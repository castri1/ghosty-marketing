/**
 * Pixel-art matrix → SVG path data, for PixelIcon (components/wg/PixelBits.tsx).
 *
 * A matrix is rows of characters: '.' = empty, 'o' = 40% tint, anything else
 * = solid. The icons used to render one 1×1 <rect> per lit cell, which put
 * roughly a thousand rects into the home page's HTML and then again into its
 * RSC payload. This covers exactly the same cells with one path per tone:
 * horizontal runs of a tone, stacked into rectangles while the row below
 * repeats the same run. The rectangles never overlap, so filling the path at
 * 40% opacity paints exactly what the separate 40% rects painted.
 *
 * Pure and dependency-free (unit-tested in lib/pixel-path.test.ts).
 */

export type PixelPaths = {
  /** Path data for the solid cells ('' when there are none). */
  solid: string;
  /** Path data for the 40% tint cells ('o'; '' when there are none). */
  tint: string;
};

type Box = { x: number; y: number; w: number; h: number; tint: boolean };

export function pixelPaths(rows: readonly string[]): PixelPaths {
  const done: Box[] = [];
  // Rectangles still growing downward, keyed by their run on the last row.
  let open = new Map<string, Box>();

  rows.forEach((row, y) => {
    const next = new Map<string, Box>();
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') {
        x++;
        continue;
      }
      const tint = ch === 'o';
      let end = x + 1;
      while (end < row.length && row[end] !== '.' && (row[end] === 'o') === tint) end++;
      const key = `${x}:${end - x}:${tint ? 'o' : '#'}`;
      const above = open.get(key);
      if (above) {
        above.h++;
        open.delete(key);
        next.set(key, above);
      } else {
        next.set(key, { x, y, w: end - x, h: 1, tint });
      }
      x = end;
    }
    open.forEach((box) => done.push(box));
    open = next;
  });
  open.forEach((box) => done.push(box));

  // Emit in reading order so the output is stable and easy to eyeball.
  done.sort((a, b) => a.y - b.y || a.x - b.x);
  let solid = '';
  let tint = '';
  for (const { x, y, w, h, tint: isTint } of done) {
    const seg = `M${x} ${y}h${w}v${h}H${x}z`;
    if (isTint) tint += seg;
    else solid += seg;
  }
  return { solid, tint };
}
