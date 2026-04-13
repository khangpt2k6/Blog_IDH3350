# videos/

Reserved folder for video embeds. Drop `.mp4` files here.

## How to embed a video in a section

Add a `<figure>` block inside the relevant `sections/s*.html` file:

```html
<figure class="image-suggestion" style="padding:0;overflow:hidden;">
  <video controls poster="images/your-poster.jpg" style="width:100%;border-radius:var(--border-radius-md);">
    <source src="videos/your-video.mp4" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>
  <figcaption>Caption for the video. Source: …</figcaption>
</figure>
```

## Tips
- Keep videos under **50 MB** for fast local loading
- Add a `poster` image (screenshot of the video) so the player shows a preview before play
- Use `.mp4` (H.264) for maximum browser compatibility
- For external videos (YouTube, Vimeo), use an `<iframe>` embed instead of a `<video>` tag
