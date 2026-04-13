# images/

Drop image files here. The HTML references them by the filenames listed below.
If a file is missing, a styled placeholder text box appears automatically (graceful fallback via `onerror`).

| Filename | Used in | Description | Suggested source |
|---|---|---|---|
| `tampa-bay-coastline.jpg` | Section 1 | Aerial of Tampa Bay showing urban development alongside mangroves | NOAA Office for Coastal Management · USF Water Institute archives |
| `fast-fashion-landfill.jpg` | Section 3 | Split image: fast fashion store vs. textile landfill | Ellen MacArthur Foundation report imagery · Getty open-license |
| `attitude-behavior-gap.jpg` | Section 4 | Infographic of the attitude–behavior gap | Creative Commons from educational journals · or create original |
| `usf-campus-sustainability.jpg` | Section 8 | USF Tampa campus — green spaces, solar panels, LEED buildings | USF Office of Communications · usf.edu/communications |

## Accepted formats
`.jpg`, `.png`, `.webp` — all work. Recommended max width: **1200px** to keep page load fast.

## How images render
Each `<figure>` in the section HTML has:
```html
<img src="images/filename.jpg" alt="…" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
<div style="display:none">  ← fallback placeholder text  </div>
<figcaption>Caption text</figcaption>
```
Drop the file in this folder and refresh — no code changes needed.
