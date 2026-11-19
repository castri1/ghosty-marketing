import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { pixelPaths } from './pixel-path.ts';

/**
 * The real icon matrices, read from the component source (PixelBits.tsx is
 * TSX, which the bare Node runner can't import). Every row is a quoted run of
 * '.', '#' and 'o'.
 */
function sourceIcons(): Record<string, string[]> {
  const src = readFileSync(new URL('../components/wg/PixelBits.tsx', import.meta.url), 'utf8');
  const block = /export const PX = \{([\s\S]*?)\n\} as const;/.exec(src);
  assert.ok(block, 'PX block found in PixelBits.tsx');
  const icons: Record<string, string[]> = {};
  for (const [, name, body] of block[1].matchAll(/(\w+): \[([^\]]*)\]/g)) {
    icons[name] = [...body.matchAll(/"([.#o]+)"/g)].map((m) => m[1]);
  }
  return icons;
}

type Cell = '.' | '#' | 'o';

/**
 * Rasterize the emitted path data back onto a cell grid. Only accepts the
 * exact shape pixelPaths emits (`M x y h w v h H x z`, repeated) and fails on
 * any overlap, so a 40%-opacity path can never paint a cell twice.
 */
function rasterize(d: string, tone: Cell, grid: Cell[][]) {
  if (d === '') return;
  const seg = /M(\d+) (\d+)h(\d+)v(\d+)H(\d+)z/g;
  let consumed = 0;
  for (const m of d.matchAll(seg)) {
    assert.equal(m.index, consumed, `unexpected path syntax at ${consumed} in ${d}`);
    consumed += m[0].length;
    const [x, y, w, h, back] = m.slice(1).map(Number);
    assert.equal(back, x, 'each rectangle closes back to its own x');
    assert.ok(w > 0 && h > 0, 'no empty rectangles');
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        assert.ok(grid[yy] && xx < grid[yy].length, `cell ${xx},${yy} inside the matrix`);
        assert.equal(grid[yy][xx], '.', `cell ${xx},${yy} painted once`);
        grid[yy][xx] = tone;
      }
    }
  }
  assert.equal(consumed, d.length, `whole path parsed: ${d}`);
}

function render(rows: readonly string[]): string[] {
  const { solid, tint } = pixelPaths(rows);
  const grid = rows.map((r) => [...r].map((): Cell => '.'));
  rasterize(solid, '#', grid);
  rasterize(tint, 'o', grid);
  return grid.map((r) => r.join(''));
}

/** What the old per-cell <rect> renderer painted: '.' empty, 'o' 40%, else solid. */
function expected(rows: readonly string[]): string[] {
  return rows.map((r) => [...r].map((ch) => (ch === '.' ? '.' : ch === 'o' ? 'o' : '#')).join(''));
}

describe('pixelPaths', () => {
  const icons = sourceIcons();

  test('reads all icons from the component source', () => {
    assert.ok(Object.keys(icons).length >= 15, `found ${Object.keys(icons).join(', ')}`);
    for (const [name, rows] of Object.entries(icons)) {
      assert.ok(rows.length > 0, `${name} has rows`);
      assert.ok(rows.every((r) => r.length === rows[0].length), `${name} is rectangular`);
    }
  });

  for (const [name, rows] of Object.entries(sourceIcons())) {
    test(`${name}: paints exactly the cells the per-cell rects painted`, () => {
      assert.deepEqual(render(rows), expected(rows));
    });
  }

  test('merges runs and stacks repeated runs into rectangles', () => {
    assert.deepEqual(pixelPaths(['##.', '##.']), { solid: 'M0 0h2v2H0z', tint: '' });
    assert.deepEqual(pixelPaths(['#o#']), { solid: 'M0 0h1v1H0zM2 0h1v1H2z', tint: 'M1 0h1v1H1z' });
    // A run that changes width starts a new rectangle.
    assert.deepEqual(pixelPaths(['###', '##.']), { solid: 'M0 0h3v1H0zM0 1h2v1H0z', tint: '' });
  });

  test('any non-dot, non-o character is solid; empty matrices emit nothing', () => {
    assert.deepEqual(render(['x#o.']), ['##o.']);
    assert.deepEqual(pixelPaths(['...', '...']), { solid: '', tint: '' });
  });

  test('is far smaller than one rect per cell', () => {
    const { solid, tint } = pixelPaths(icons.ghost);
    const cells = icons.ghost.join('').replace(/\./g, '').length;
    assert.ok(solid.length + tint.length < cells * 12, `${solid.length + tint.length} chars for ${cells} cells`);
  });
});
