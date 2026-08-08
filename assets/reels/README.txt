# Saxophone reel thumbnails

The "Watch me play" cards show a real image if one exists here, otherwise they
fall back to a colored gradient.

To show your actual clip thumbnails:

1. Open one of your posts on Instagram/TikTok, screenshot or save the cover
   frame (a vertical 9:16 image looks best).
2. Save the images in THIS folder named exactly:
   - r1.jpg  (Instagram — "Latest reel" card)
   - r2.jpg  (TikTok — "Newest clip" card)
   - r3.jpg  (Instagram — "Cover" card)
   - r4.jpg  (TikTok — "Improv" card)
3. Refresh the site — the thumbnails appear automatically.

To make each card open a SPECIFIC video (not just your profile), edit the
matching `<a class="reel" href="…">` in `index.html` and paste the post URL.

Why not automatic? Instagram and TikTok block automated access, so thumbnails
and individual video URLs can't be pulled programmatically — they need to be
added by hand (or embedded with the official embed code).
