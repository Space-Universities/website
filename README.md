# Space Universities Network website

A static rebuild of spaceuniversitiesnetwork.ac.uk (previously WordPress on
uksun.blogs.bristol.ac.uk), built with [Jekyll](https://jekyllrb.com/) so it can be
hosted free on GitHub Pages. All page addresses and file links match the old site.

The pages keep the WordPress (Divi) theme's markup and styles, so the site looks the
same as the old one. That is why page files contain `et_pb_...` class names.

## Adding a news item

1. Copy `_templates/news-post.md` into the `_posts/` folder.
2. Rename it `YYYY-MM-DD-short-title.md`, e.g. `2026-11-03-workshop-2026.md`.
   The short title becomes the web address: `/workshop-2026/`.
3. Fill in the title, date, author, categories and (optionally) an image at the top,
   then write the article below the `---` line in plain text (Markdown).
4. Put any pictures in `files/YYYY/MM/` and refer to them as
   `/files/YYYY/MM/name.jpg`.
5. Commit/upload. GitHub rebuilds the site in a minute or two.

You can do all of this on github.com: open `_posts`, choose **Add file → Create new file**,
paste the template, and **Commit changes**. Use **Add file → Upload files** for pictures.

Existing categories: Announcements, Blog, Events, Knowledge Sharing, Mars Yard,
RocketLab!, Updates. Each has a page at `/category/<name>/`.

## Showing news or resources on a page

The News page, category pages and "More resources" lists all use one include. To add a
list to another page, put this inside a Divi module in the page's HTML:

```liquid
{% include divi-posts.html limit=3 image=true meta=true excerpt=true grid=true %}
```

Options: `source="resources"` (resource bank instead of news), `category="Events"`
(news category name, or resource category such as `class-resources`), `limit` (how many),
`image`, `meta`, `excerpt`, `more` (show the picture, byline, summary, "read more" link),
and `grid` (cards in three columns rather than a plain list).

## Adding a resource-bank item

Create a file in `_resources/`, e.g. `_resources/my-new-resource.md`:

```markdown
---
title: "My new resource – University of Somewhere"
date: 2026-11-03
categories: [class-resources]      # case-studies, industry-case-studies, class-resources, events, facilities-database
levels: ["4", "5", "6"]            # student levels (1–8, or "NA")
summary: "One-sentence description shown on cards and in search."
image: /files/2026/11/picture.jpg  # optional
---

Description, links and downloads go here.
```

It appears automatically in its category page(s) and in the resource search,
at `/project/my-new-resource/`.

## Editing pages and the menu

- Pages are HTML files that mirror their address, e.g. `/about-us/our-groups/` is
  `about-us/our-groups.html`. Edit the text between the tags. Each page starts with a
  `<style>` block holding that page's own colours, spacing and backgrounds, copied
  from WordPress; change values there to restyle one section.
- The main menu is `_data/navigation.yml`. The header and footer are in `_includes/`.
- Site-wide settings (contact email, social links, form links) are in `_config.yml`.
- Styles: `assets/css/divi.css` is the Divi theme's base CSS (trimmed),
  `assets/css/theme.css` holds the site-wide Divi settings (header, footer, post and
  archive templates), and `assets/css/site.css` covers the parts rebuilt for the static
  site (email panels, resource search, searchable tables).
- `assets/js/site.js` runs the mobile menu, accordions, tabs, testimonial slider,
  searchable tables and resource search.

## Publishing on GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. In the repository go to **Settings → Pages**, choose **Deploy from a branch**,
   select `main` and `/ (root)`, and save.
3. The site appears at `https://<user>.github.io/<repo>/`. For that address, set
   `url: "https://<user>.github.io"` and `baseurl: "/<repo>"` in `_config.yml`.
4. To use spaceuniversitiesnetwork.ac.uk, add it under **Settings → Pages → Custom
   domain**, keep `baseurl: ""`, and ask whoever manages the domain's DNS to point it
   at GitHub Pages (see GitHub's "Managing a custom domain" guide).

## Previewing on your own computer (optional)

Install Ruby (https://rubyinstaller.org, "with Devkit"), then in this folder run:

```
bundle install
bundle exec jekyll serve
```

and open http://localhost:4000.

## Things that changed from the WordPress site

- **Contact Us** and **Contribute Resource** now show email buttons instead of
  WordPress forms. To use an online form instead (e.g. Microsoft Forms), paste its
  link into `forms:` in `_config.yml`.
- **Resource search** now runs in the browser (title/topic text, category and level).
- The "Tell us how you used this resource" / "Review our Resource" feedback forms
  under resources and posts now point to the contact email.
- The News page lists every post on one page instead of ten per page.
- Google Analytics is not included.

## Links that were already broken on the old site

These files are linked from pages but didn't exist on the WordPress server:

- Space Competitions page: `FINAL-IOSM-Challenge-Two-23_24.docx`,
  `National-Rocketry-Championship-Technical-Guidelines-23_24.docx`,
  `SDC-Competition-Overview-23_24.docx`, `SDC-Rules-Requirements-Template-23_24.docx`,
  `airbusortrulesrequirements23-24.docx`, `ralspaceortrulesrequirements23_24.docx`
- Background images `Webb_explores_a_pair_of_merging_galaxies.jpg` (Contact Us) and
  `UK_Space_Agency_logo_pillars.jpg` (About Us)
- Two links to the pre-WordPress site (`/sites/default/files/...`)

If you have copies, add them to `files/` at the matching path.

## Regenerating from WordPress (rarely needed)

The pages were generated from the WordPress export in `../wp-export` by the scripts in
`../tools` (see `../tools/README.md`). You only need these to start again from WordPress
or to refresh `assets/css/divi.css` after using a Divi module type the site didn't use before.
