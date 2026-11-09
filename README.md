# KAIDI — artist portfolio

A buildless HTML / CSS / JavaScript prototype. No npm installation or build step. All images are original abstract SVG placeholders, not documentation of actual artworks. Replace them with your own work.

## Run locally

Extract this folder. In VS Code, open the folder and use the **Live Server** extension, then right-click `index.html` → **Open with Live Server**.

Alternatively, if Python is installed, open a terminal inside this folder:

```sh
python -m http.server 8000
```

On Windows, `py -m http.server 8000` also works. Open http://localhost:8000. Stop with Ctrl+C. Double-clicking HTML files does not work reliably because browsers restrict loading JSON from local files.

## Files

- `index.html`: homepage structure.
- `project.html`: reusable project page, e.g. `project.html?slug=soft-signal`.
- `assets/css/style.css`: all styling, including the shared red color.
- `assets/js/home.js`: filtering and scroll-linked SVG connections.
- `assets/js/project.js`: project page template.
- `assets/js/data.js`: shared content loading and validation.
- `content/projects.json`: all project content.
- `assets/images/`: local cover images and media.

The JSON file is **data, not Python**. HTML provides structure, CSS provides styling, and JavaScript reads the data and handles interactions. Each project has its own bookmarkable URL through the shared template; no generated folder or new HTML page is needed for each project.

## Add or edit projects

Edit `content/projects.json` in any text editor. Copy an existing object, put a comma between objects, and give it a unique slug. Use double quotes and no trailing commas. Place images in `assets/images/` and reference their relative paths. The order of objects controls the homepage order. All paths are relative to the website root and work under GitHub repository subpaths.

Example project:

```json
{
  "title": "Your Project",
  "year": "2026",
  "slug": "your-project",
  "cover": "assets/images/your-photo.jpg",
  "coverAlt": "Describe what the image shows",
  "formats": ["Installation", "Sculpture"],
  "inquiries": ["Embodiment", "Transformation"],
  "description": "Your project description.\nA second paragraph.",
  "credits": "Created by KAIDI",
  "media": [
    {"type": "image", "src": "assets/images/detail.jpg", "alt": "Detail of the work"},
    {"type": "video", "src": "assets/images/documentation.mp4"}
  ]
}
```

Formats: Installation, Image, Sculpture, Website. Inquiries: Agency, Embodiment, Perception, Transformation. Each project needs at least one of each. `All Formats` and `All Themes` reset their respective filters; clicking any category selects that category alone and clears the previous selection, including the other side. Empty results show a message. Lines connect visible projects to their assigned categories and never capture pointer events. On small screens categories stay fixed across the top. Titles also appear on keyboard focus and touch devices.

Project pages initially show title and year. Add description, credits, and media to populate the existing template. The cover remains a homepage image unless you also add it to media. Videos are native HTML video files, not YouTube embed URLs.

## CMS readiness

The prototype has **no active CMS or login**. Layout and project data are separate, so a future browser-based Git-backed CMS can edit `content/projects.json` and upload files into `assets/images/`. Configure a file collection with a list of projects matching the fields above; formats and inquiries should be multi-selects, and media a list with type, source, and alt text. A CMS such as Decap would require separate GitHub authentication/backend setup; GitHub Pages alone cannot provide that backend. No credentials belong in this public folder. Until then, use GitHub's browser file editor or edit locally.

## Publish to GitHub Pages later

1. Create a GitHub repository. Upload the **contents** of this folder to the repository root, including `.nojekyll` (not the surrounding folder or ZIP).
2. In repository Settings → Pages, choose deployment from a branch, choose your main branch and `/ (root)`, then save.
3. Visit the Pages URL shown by GitHub. The relative URLs support both a user site and a project site.
4. To update, commit changed JSON, media, HTML, CSS, or JS to that branch. No build is needed.

## Existing custom domain

In repository Settings → Pages, enter your actual custom domain and save. Configure DNS with your domain provider following GitHub's current official guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site . Use the documented records for your apex domain or subdomain, wait for DNS to propagate, then enable HTTPS when available. GitHub may create a `CNAME` file; retain it in later updates. No domain has been configured in this prototype because your domain was not supplied.

## Customization

Change “KAIDI” in both HTML files and the document title logic if needed. The font stack is Helvetica, Arial, sans-serif (Helvetica must be installed on the visitor's device; otherwise Arial is used). Change `--red` in CSS and the matching stroke value in `home.js` together. Images preserve their aspect ratio; landscape and portrait covers both work. No analytics, external fonts, tracking, or third-party runtime dependencies are included.

## November update

Homepage captions and footer have been removed. Gently curved, opaque 1px dark red connections meet matching 1px image borders and update as you scroll. The left heading is Medium; the reset button remains All Formats. All pages include fixed corner links: KAIDI (home), About, Exhibitions, Contact. Edit the body content in `about.html`, `exhibitions.html`, and `contact.html` to fill in these initially blank pages.

The combined update includes all corner pages, the Medium heading (with All Formats unchanged), darker red, image frames, and no homepage captions/footer. Connections use consistent smooth curves with ordered attachment points rather than random bends.

Latest update: larger fixed corner navigation on all pages; compact project headings; red Medium/Inquiry labels; each category click displays all connected projects and returns to the top. Asset version URLs refresh older cached CSS/JS.

Connection coordinates now use the SVG viewport size, including scrollbar effects. With a category selected, only its connections appear on that side; the opposite side continues to show the displayed projects’ associations. Medium and Inquiry match tag font sizes.

Gallery sizing adapts to the viewport: the first image leaves space for a preview of the next project. Images keep their original proportions. On mobile the gallery begins below the measured category menus. Scrolling remains natural.

## Complete folder recovery

This archive includes all JavaScript dependencies, project data, four SVG covers, and the supplied PNG favicon. To recover missing files, extract the complete artist-portfolio folder into a new location and run the local server from inside it. Keep any existing folder as a backup if you have edited your content.

Scroll scaling: projects grow toward the viewport center and shrink away from it. Stable layout slots avoid scroll jumps. Equal end spacing centers the first and last project at the scroll limits. Connections follow scaled image bounds. Reduced-motion preferences disable scaling.

## TOUCH SCREEN and Vimeo

TOUCH SCREEN replaces the first placeholder. Its homepage cover uses Vimeo 1244913171, muted, looping, and autoplaying; clicking opens the project page. The supplied photograph appears behind the player while loading. Reduced-motion visitors see the photograph. The project page includes that photo, dimensions, and both videos with controls and Vimeo fallback links. Year, description, materials, and credits are intentionally blank pending final content. Medium Installation and inquiries Agency/Perception are provisional editable assignments.

Project content accepts `coverVideo` (a Vimeo link), `videoAspectRatio` (default `16 / 9`), and media entries with `type: "vimeo"`, `src`, `title`, and `aspectRatio`. Vimeo viewing/embed privacy must permit playback on your testing host and eventual domain. Browser/device autoplay restrictions may prevent preview playback. The website needs internet access for Vimeo; local photos remain available. Video dimensions currently default to 16:9 and can be adjusted in JSON.

Video corrections: TOUCH SCREEN uses 2026, Installation/Sculpture, Perception/Transformation. The video player appears immediately (streaming still takes time); the photo is reserved for reduced motion. Embeds use the source 3:2 frame without image borders or external text links. The background player reinforces looping through Vimeo events and a near-end restart.

## Black theme

The current theme uses a black background, light text, and brighter red (#df303a) for readable category labels and connections. Theme colors are defined as CSS variables at the beginning of style.css.

Überwachung is the second project with two Vimeo embeds and two supplied photographs. The unlisted video hash is preserved. Year is blank pending confirmation; Installation and Agency/Perception plus the description are draft content. Category headings are bold and connection strokes are 1.3px.

About and Contact content is stored in content/site.json and rendered by assets/js/pages.js. The supplied About text is preserved verbatim. Email and Instagram are clickable. All present and future Vimeo embeds inherit a subtle 0.8% edge crop from the shared styles.

Exhibitions posters are defined in content/site.json under exhibitions. Each entry has image and alt fields; their array order controls display order. Posters use an uncropped two-column desktop grid and single column on mobile, with no links.

Well Done Chicken is the third project, with a looping Vimeo cover, four supplied images, and the requested collaboration credit. The homepage now contains three real projects and no placeholder entries. Its year is blank pending confirmation; Installation and Agency/Transformation are provisional tags.
