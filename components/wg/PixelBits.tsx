/**
 * Shared retro building blocks for the alt design: pixel-art icons drawn
 * from character matrices ('#' = solid, 'o' = 40% tint, '.' = empty),
 * a checkered dither edge for section transitions, and the ghost sprite.
 */

export function PixelIcon({
  rows,
  className,
}: {
  rows: string[];
  className?: string;
}) {
  const h = rows.length;
  const w = rows[0].length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              className="fill-current"
              opacity={ch === "o" ? 0.4 : 1}
            />
          )
        )
      )}
    </svg>
  );
}

export const PX = {
  ghost: [
    "...#####...",
    "..#######..",
    ".#########.",
    ".##.###.##.",
    ".##.###.##.",
    ".#########.",
    ".#########.",
    ".#########.",
    ".#.##.##.#.",
  ],
  laptop: [
    ".#########.",
    ".#ooooooo#.",
    ".#o.....o#.",
    ".#o.....o#.",
    ".#ooooooo#.",
    ".#########.",
    "...........",
    "###########",
    "#o.......o#",
    "###########",
  ],
  scatter: [
    "##.........",
    "##...oo....",
    ".....oo....",
    "...........",
    "......##...",
    "oo....##...",
    "oo.........",
    ".........oo",
    "...##....oo",
    "...##......",
  ],
  question: [
    "..######...",
    ".##....##..",
    ".o......##.",
    "........##.",
    "......##o..",
    ".....##....",
    ".....##....",
    "...........",
    ".....##....",
    ".....##....",
  ],
  chat: [
    "#########..",
    "#ooooooo#..",
    "#o.....o#..",
    "#o.....o#..",
    "#ooooooo#..",
    "#########..",
    "...##......",
    "..##.......",
    ".#.........",
  ],
  sparkle: [
    ".....#.....",
    ".....#.....",
    "....###....",
    "..#######..",
    "#####o#####",
    "..#######..",
    "....###....",
    ".....#.....",
    ".....#.....",
  ],
  people: [
    "...........",
    "..##...##..",
    "..##...##..",
    "...........",
    ".####.####.",
    ".####.####.",
    ".####.####.",
    ".#o.#.#o.#.",
  ],
  shield: [
    ".#########.",
    ".#o.....o#.",
    ".#.......#.",
    ".#..###..#.",
    ".##..#..##.",
    "..#..#..#..",
    "...#####...",
    "....###....",
    ".....#.....",
  ],
  grid: [
    "####.####..",
    "####.####..",
    "####.####..",
    "...........",
    "####.####..",
    "####.####..",
    "####.####..",
  ],
  eye: [
    "...........",
    "..ooooooo..",
    ".o.......o.",
    "o...###...o",
    "o...###...o",
    "o...###...o",
    ".o.......o.",
    "..ooooooo..",
  ],
  toggle: [
    "...........",
    ".oooo#####.",
    "o....#####.",
    "o....#####.",
    "o....#####.",
    ".oooo#####.",
    "...........",
  ],
  lock: [
    "...#####...",
    "..##...##..",
    "..##...##..",
    ".#########.",
    ".#o.....o#.",
    ".#...#...#.",
    ".#...#...#.",
    ".#o.....o#.",
    ".#########.",
  ],
  building: [
    ".#########.",
    ".#o.o.o.o#.",
    ".#.......#.",
    ".#o.o.o.o#.",
    ".#.......#.",
    ".#o.o.o.o#.",
    ".#...#...#.",
    ".#...#...#.",
    ".#########.",
  ],
  gauge: [
    "...........",
    "...#####...",
    "..#.....#..",
    ".#...#...#.",
    ".#..##...#.",
    ".#.#.....#.",
    "..#.....#..",
    "...#####...",
    "...........",
  ],
  plug: [
    "...#...#...",
    "...#...#...",
    ".#######...",
    ".#######...",
    "..#####....",
    "...###.....",
    "....#......",
    "...###.....",
    "...........",
  ],
} as const;

/**
 * Checkered dissolve between sections. Place at the top of a section and
 * pass the color of the PREVIOUS section — it dithers from solid to
 * transparent over three 8px pixel rows.
 */
export function PixelEdge({ color }: { color: string }) {
  const rows: Array<[number, number]> = [
    [24, 32], // 75% density
    [16, 32], // 50%
    [8, 32], // 25%
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {rows.map(([on, period], i) => (
        <div
          key={i}
          className="h-2 w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 ${on}px, transparent ${on}px ${period}px)`,
            backgroundPositionX: `${i * 12}px`,
          }}
        />
      ))}
    </div>
  );
}
