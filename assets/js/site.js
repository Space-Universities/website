// Interactive parts of the SUN site. The pages use Divi's markup, so this script stands in
// for the bits of Divi's JavaScript they rely on: mobile menu, toggles, tabs, sliders,
// clickable modules and searchable tables. Also runs the resource search.
(function () {
  "use strict";

  var each = function (sel, fn, root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn);
  };

  // ---- mobile menu: Divi copies the menu into a drop-down under the hamburger ----
  each(".et_pb_menu", function (menu) {
    var nav = menu.querySelector(".et-menu-nav > ul");
    var bar = menu.querySelector(".mobile_nav");
    if (!nav || !bar) return;
    var list = nav.cloneNode(true);
    list.className = "et_mobile_menu";
    list.removeAttribute("id");
    list.style.display = "none";
    bar.appendChild(list);
    var toggle = function () {
      var open = bar.classList.toggle("opened");
      bar.classList.toggle("closed", !open);
      list.style.display = open ? "block" : "none";
      bar.querySelector(".mobile_menu_bar").setAttribute("aria-expanded", open ? "true" : "false");
    };
    var button = bar.querySelector(".mobile_menu_bar");
    button.addEventListener("click", toggle);
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  // ---- toggles and accordions ----
  each(".et_pb_toggle", function (toggle) {
    var title = toggle.querySelector(".et_pb_toggle_title");
    if (!title) return;
    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");
    var set = function (t, open) {
      t.classList.toggle("et_pb_toggle_open", open);
      t.classList.toggle("et_pb_toggle_close", !open);
      var h = t.querySelector(".et_pb_toggle_title");
      if (h) h.setAttribute("aria-expanded", open ? "true" : "false");
    };
    set(toggle, toggle.classList.contains("et_pb_toggle_open"));
    var flip = function () {
      var open = !toggle.classList.contains("et_pb_toggle_open");
      var accordion = toggle.closest(".et_pb_accordion");
      if (accordion && open) {
        each(".et_pb_toggle", function (other) { if (other !== toggle) set(other, false); }, accordion);
      }
      if (accordion && !open) return; // an accordion keeps one item open, as in Divi
      set(toggle, open);
    };
    title.addEventListener("click", flip);
    title.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
  });

  // ---- tabs ----
  each(".et_pb_tabs", function (box) {
    var controls = box.querySelectorAll(".et_pb_tabs_controls li");
    var panels = box.querySelectorAll(".et_pb_all_tabs > .et_pb_tab");
    var select = function (i) {
      Array.prototype.forEach.call(controls, function (li, j) { li.classList.toggle("et_pb_tab_active", i === j); });
      Array.prototype.forEach.call(panels, function (p, j) {
        p.classList.toggle("et_pb_active_content", i === j);
        p.style.display = i === j ? "block" : "none";
      });
    };
    Array.prototype.forEach.call(controls, function (li, i) {
      var a = li.querySelector("a") || li;
      a.addEventListener("click", function (e) { e.preventDefault(); select(i); });
    });
    var start = 0;
    Array.prototype.forEach.call(controls, function (li, i) { if (li.classList.contains("et_pb_tab_active")) start = i; });
    select(start);
  });

  // ---- sliders ----
  each(".et_pb_slider", function (slider) {
    var slides = slider.querySelectorAll(".et_pb_slides > .et_pb_slide");
    if (slides.length < 2) return;
    var current = 0;
    var dots = document.createElement("div");
    dots.className = "et-pb-controllers";
    var arrows = document.createElement("div");
    arrows.className = "et-pb-slider-arrows";
    arrows.innerHTML = '<a class="et-pb-arrow-prev" href="#" aria-label="Previous"><span>Previous</span></a>' +
      '<a class="et-pb-arrow-next" href="#" aria-label="Next"><span>Next</span></a>';
    var show = function (i) {
      current = (i + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (s, j) {
        s.classList.toggle("et-pb-active-slide", j === current);
        s.style.display = j === current ? "list-item" : "none";
      });
      Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle("et-pb-active-control", j === current); });
    };
    Array.prototype.forEach.call(slides, function (s, i) {
      var d = document.createElement("a");
      d.href = "#";
      d.textContent = i + 1;
      d.addEventListener("click", function (e) { e.preventDefault(); show(i); restart(); });
      dots.appendChild(d);
    });
    var container = slider.querySelector(".et_pb_slides");
    if (!slider.classList.contains("et_pb_slider_no_arrows")) slider.appendChild(arrows);
    if (!slider.classList.contains("et_pb_slider_no_pagination")) container.parentNode.appendChild(dots);
    arrows.querySelector(".et-pb-arrow-prev").addEventListener("click", function (e) { e.preventDefault(); show(current - 1); restart(); });
    arrows.querySelector(".et-pb-arrow-next").addEventListener("click", function (e) { e.preventDefault(); show(current + 1); restart(); });
    var timer = null;
    var speed = 7000;
    var m = slider.className.match(/et_slider_speed_(\d+)/);
    if (m) speed = parseInt(m[1], 10);
    var auto = slider.classList.contains("et_slider_auto");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var restart = function () {
      if (!auto || reduce) return;
      clearInterval(timer);
      timer = setInterval(function () { show(current + 1); }, speed);
    };
    show(0);
    restart();
  });

  // ---- images set to stick to the bottom of their section (Divi removes the section's bottom padding) ----
  each(".et_pb_image_sticky", function (img) {
    var row = img.closest(".et_pb_row");
    var section = row && row.closest(".et_pb_section");
    var column = img.closest(".et_pb_column");
    if (!section || !column) return;
    var rows = section.querySelectorAll(":scope > .et_pb_row");
    if (row !== rows[rows.length - 1]) return;
    row.classList.add("et-last-child");
    var modules = column.querySelectorAll(":scope > .et_pb_module");
    if (img !== modules[modules.length - 1]) return;
    section.classList.add("et_pb_section_sticky");
    column.classList.add("et_pb_row_sticky");
    var columns = row.querySelectorAll(":scope > .et_pb_column");
    if (column === columns[columns.length - 1]) section.classList.add("et_pb_section_sticky_mobile");
  });

  // ---- modules that link somewhere as a whole ----
  each(".et_clickable[data-href]", function (el) {
    el.style.cursor = "pointer";
    el.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      if (el.getAttribute("data-target") === "_blank") window.open(el.getAttribute("data-href"), "_blank", "noopener");
      else window.location.href = el.getAttribute("data-href");
    });
  });

  // ---- searchable, sortable, paged tables (same markup as DataTables 2, which TablePress used) ----
  var el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  each("table[data-datatable]", function (table, n) {
    var body = table.tBodies[0];
    var rows = Array.prototype.slice.call(body.rows);
    var size = parseInt(table.getAttribute("data-page-length") || "10", 10);
    var sizes = (table.getAttribute("data-length-menu") || "10,25,50,100").split(",");
    var skip = (table.getAttribute("data-unsearchable") || "").split(",").filter(Boolean).map(Number);
    var id = table.id || "dt-table-" + n;
    table.id = id;
    var page = 0, sortCol = -1, sortDir = 1;

    var wrap = el("div", "dt-container");
    wrap.id = id + "_wrapper";
    table.parentNode.insertBefore(wrap, table);

    var top = el("div", "dt-layout-row");
    var lengthCell = el("div", "dt-layout-cell dt-layout-start");
    var length = el("div", "dt-length");
    var select = el("select", "dt-input");
    select.id = "dt-length-" + n;
    select.setAttribute("aria-controls", id);
    sizes.forEach(function (s) {
      var o = el("option", null, s);
      o.value = s;
      if (parseInt(s, 10) === size) o.selected = true;
      select.appendChild(o);
    });
    var lengthLabel = el("label", null, " entries per page");
    lengthLabel.htmlFor = select.id;
    length.appendChild(select);
    length.appendChild(lengthLabel);
    lengthCell.appendChild(length);

    var searchCell = el("div", "dt-layout-cell dt-layout-end");
    var search = el("div", "dt-search");
    var input = el("input", "dt-input");
    input.type = "search";
    input.id = "dt-search-" + n;
    input.setAttribute("aria-controls", id);
    var searchLabel = el("label", null, table.getAttribute("data-search-label") || "Search:");
    searchLabel.htmlFor = input.id;
    search.appendChild(searchLabel);
    search.appendChild(input);
    searchCell.appendChild(search);
    top.appendChild(lengthCell);
    top.appendChild(searchCell);

    var middle = el("div", "dt-layout-row dt-layout-table");
    var full = el("div", "dt-layout-cell dt-layout-full");
    var scroll = el("div", "dt-scroll");
    middle.appendChild(full);
    full.appendChild(scroll);

    var bottom = el("div", "dt-layout-row");
    var infoCell = el("div", "dt-layout-cell dt-layout-start");
    var info = el("div", "dt-info");
    info.id = id + "_info";
    info.setAttribute("role", "status");
    info.setAttribute("aria-live", "polite");
    infoCell.appendChild(info);
    var pagerCell = el("div", "dt-layout-cell dt-layout-end");
    var pager = el("div", "dt-paging paging_simple_numbers");
    var nav = el("nav");
    nav.setAttribute("aria-label", "pagination");
    pager.appendChild(nav);
    pagerCell.appendChild(pager);
    bottom.appendChild(infoCell);
    bottom.appendChild(pagerCell);

    wrap.appendChild(top);
    wrap.appendChild(middle);
    scroll.appendChild(table);
    wrap.appendChild(bottom);
    table.classList.add("dataTable");
    table.setAttribute("aria-describedby", info.id);

    var text = rows.map(function (r) {
      return Array.prototype.filter.call(r.cells, function (c, i) { return skip.indexOf(i) === -1; })
        .map(function (c) { return c.textContent; }).join(" ").toLowerCase();
    });

    // sortable column headers
    var heads = table.tHead ? Array.prototype.slice.call(table.tHead.rows[0].cells) : [];
    heads.forEach(function (th, i) {
      var title = el("span", "dt-column-title");
      while (th.firstChild) title.appendChild(th.firstChild);
      var order = el("span", "dt-column-order");
      order.setAttribute("role", "button");
      order.setAttribute("tabindex", "0");
      order.setAttribute("aria-label", title.textContent + ": Activate to sort");
      var header = el("div", "dt-column-header");
      header.appendChild(title);
      header.appendChild(order);
      th.appendChild(header);
      th.classList.add("dt-orderable-asc", "dt-orderable-desc");
      var sortBy = function () {
        sortDir = sortCol === i ? -sortDir : 1;
        sortCol = i;
        heads.forEach(function (h, j) {
          h.classList.toggle("dt-ordering-asc", j === i && sortDir === 1);
          h.classList.toggle("dt-ordering-desc", j === i && sortDir === -1);
        });
        var order = rows.map(function (r, k) { return k; }).sort(function (a, b) {
          var x = rows[a].cells[i] ? rows[a].cells[i].textContent.trim() : "";
          var y = rows[b].cells[i] ? rows[b].cells[i].textContent.trim() : "";
          return x.localeCompare(y, undefined, { numeric: true }) * sortDir;
        });
        rows = order.map(function (k) { return rows[k]; });
        text = order.map(function (k) { return text[k]; });
        rows.forEach(function (r) { body.appendChild(r); });
        render();
      };
      th.addEventListener("click", sortBy);
      order.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortBy(); }
      });
    });

    var button = function (label, cls, to, disabled) {
      var b = el("button", "dt-paging-button" + (cls ? " " + cls : "") + (disabled ? " disabled" : ""), label);
      b.type = "button";
      b.setAttribute("aria-controls", id);
      if (disabled) { b.setAttribute("aria-disabled", "true"); b.tabIndex = -1; }
      else b.addEventListener("click", function () { page = to; render(); });
      return b;
    };

    var render = function () {
      var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var hits = rows.filter(function (r, i) { return words.every(function (w) { return text[i].indexOf(w) !== -1; }); });
      var pages = Math.max(1, Math.ceil(hits.length / size));
      if (page >= pages) page = pages - 1;
      rows.forEach(function (r) { r.style.display = "none"; });
      var first = page * size;
      hits.slice(first, first + size).forEach(function (r) { r.style.display = ""; });
      info.textContent = hits.length
        ? "Showing " + (first + 1) + " to " + Math.min(first + size, hits.length) + " of " + hits.length + " entries" + (words.length ? " (filtered from " + rows.length + " total entries)" : "")
        : "No matching entries found";
      nav.innerHTML = "";
      nav.appendChild(button("\u2039", "previous", page - 1, page === 0));
      for (var p = 0; p < pages; p++) {
        var b = button(String(p + 1), p === page ? "current" : "", p, false);
        if (p === page) b.setAttribute("aria-current", "page");
        nav.appendChild(b);
      }
      nav.appendChild(button("\u203a", "next", page + 1, page >= pages - 1));
    };
    input.addEventListener("input", function () { page = 0; render(); });
    select.addEventListener("change", function () { size = parseInt(select.value, 10); page = 0; render(); });
    render();
  });

  // ---- resource search ----
  var search = document.querySelector(".resource-search");
  if (search) {
    var form = search.querySelector("form");
    var results = search.querySelector(".search-results");
    var count = search.querySelector(".search-count");
    var data = [];

    var esc = function (s) {
      return String(s || "").replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };

    var words = function (s) { s = s.trim().toLowerCase(); return s ? s.split(/\s+/) : []; };
    var render = function () {
      var title = words(form.q.value);
      var topic = words(form.topic.value);
      var cat = form.category.value;
      var hits = data.filter(function (r) {
        if (cat && r.categories.indexOf(cat) === -1) return false;
        var t = r.title.toLowerCase();
        if (!title.every(function (w) { return t.indexOf(w) !== -1; })) return false;
        var hay = (r.title + " " + r.summary + " " + r.text + " level " + r.levels.join(" level ")).toLowerCase();
        return topic.every(function (w) { return hay.indexOf(w) !== -1; });
      });
      count.textContent = hits.length + (hits.length === 1 ? " resource" : " resources");
      results.innerHTML = hits.map(function (r) {
        var levels = r.levels.length
          ? '<span class="levels">Levels ' + r.levels.map(function (l) { return l === "NA" ? "N/A" : esc(l); }).join(", ") + "</span>"
          : "";
        return '<article class="et_pb_post clearfix"><h2 class="entry-title"><a href="' + esc(r.url) + '">' + esc(r.title) + "</a></h2>" +
          '<p class="post-meta">' + levels + "</p>" +
          '<div class="post-content"><div class="post-content-inner">' + (r.summary ? "<p>" + esc(r.summary) + "</p>" : "") +
          '</div><a href="' + esc(r.url) + '" class="more-link">read more...</a></div></article>';
      }).join("");
    };

    fetch(search.getAttribute("data-index"))
      .then(function (res) { return res.json(); })
      .then(function (json) {
        data = json;
        var params = new URLSearchParams(location.search);
        if (params.get("q")) { form.q.value = params.get("q"); render(); }
      })
      .catch(function () { count.textContent = "Sorry, the resource list could not be loaded."; });

    // like the WordPress form, results appear once the form is submitted
    form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
  }
})();
