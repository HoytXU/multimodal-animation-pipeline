# Multimodal Animation — Project Notebook

A plain, static framework for six members to document how their projects develop. The layout opens with six avatar cards highlighting the teammates and their contributions, followed by the project overview, pipeline, and six numbered work sections. It uses serif typography, compact team profiles, and work sections with a title column beside the content. On mobile, the columns stack.

## Preview

Open `index.html` directly, or run `python3 -m http.server 8080` and visit http://localhost:8080.

## Add your work

Edit `index.html`:

- Replace the shared introduction with your project question.
- Update member names and contributions in the team cards and corresponding work sections as needed. The cards use `assets/member.jpg` as a default avatar; replace each card’s image source to add individual portraits.
- Update work-area headings as needed; keep section IDs for stable links. Hao Xu’s physical simulation section is based on the supplied thesis proposal.
- Add substantive notes and references inside each member’s `.work-content` block.
- Add examples in a `<figure class="journal-media">` with descriptive image alt text and a `<figcaption>`. Examples are capped at 400px wide and 260px tall. Link images to their original file for full-size viewing; retain playback controls on videos.
- Add new results as they become available; empty journal prompts are intentionally omitted.

All content is edited in the HTML; the page does not save in-browser edits. Native expandable sections and navigation work without JavaScript. Simplified Chinese is the default HTML language. `language.js` switches text and accessible labels between Chinese and English and remembers the selection when browser storage is available. Edit both `data-zh` and `data-en` values when updating translated text; keep the HTML text in Chinese. No external fonts or generated images are used. The user-supplied pipeline diagram is stored at `assets/pipeline-composition.png`.

## Source material

The overview follows the supplied pipeline diagram. Hao Xu’s section summarizes §§2.1–2.3 of the supplied thesis proposal; planned methods and experiments are not presented as completed results. The original PDF is not included in the site. The six work areas follow the current requested roles; member names and assignments follow the user’s latest instructions.
