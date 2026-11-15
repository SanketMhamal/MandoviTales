# River map

How `public/images/mandovi-watercolour.webp` (the "Down the Mandovi" ground) is made. Run from this folder with `npm i sharp potrace` in a scratch directory.

1. `stitch.mjs`: downloads Sentinel-2 cloudless 2016 tiles (EOX, CC BY 4.0) for the estuary at zoom 14 and stitches `mandovi-z14.jpg`.
2. `classify.mjs`: sorts each pixel into water, dense green, green land, town or sand.
3. `vectorize.mjs`: keeps only water joined to the river and sea, smooths the areas into blobs and traces them with potrace into `mandovi-map.svg`.
4. `watercolor.mjs`: repaints the SVG as watercolour (wobbly edges, pooled rims, granulation, wet blooms, ink coastline, paper grain) and bakes the WebP and its 640px thumbnail.

The map's credit line must stay on the site: "Map traced from Sentinel-2 cloudless 2016 by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016), CC BY 4.0".
