import { useMemo, useRef } from "react";
import type { CSSProperties } from "react";

export type SpanVariant = "small" | "wide" | "tall" | "large" | "hero";

type SpanDef = { col: number; row: number };

const SPAN_MAP: Record<SpanVariant, SpanDef> = {
  small: { col: 2, row: 1 },
  wide: { col: 3, row: 1 },
  tall: { col: 4, row: 1 },
  large: { col: 4, row: 1 },
  hero: { col: 6, row: 1 },
};

const VARIANT_WEIGHTS: Record<SpanVariant, number> = {
  small: 0.35,
  wide: 0.4,
  tall: 0.2,
  large: 0,
  hero: 0.05,
};

function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function pickVariant(
  rand: () => number,
  maxCols: number,
  largeCount: number,
  heroCount: number,
): SpanVariant {
  const eligible: [SpanVariant, number][] = [];

  for (const [v, w] of Object.entries(VARIANT_WEIGHTS)) {
    const variant = v as SpanVariant;
    const span = SPAN_MAP[variant];
    if (span.col > maxCols) continue;
    if (variant === "large" && largeCount >= 2) continue;
    if (variant === "hero" && heroCount >= 1) continue;
    eligible.push([variant, w]);
  }

  if (eligible.length === 0) return "small";

  const totalWeight = eligible.reduce((sum, [, w]) => sum + w, 0);
  let r = rand() * totalWeight;

  for (const [variant, weight] of eligible) {
    r -= weight;
    if (r <= 0) return variant;
  }

  return eligible[eligible.length - 1][0];
}

export function useCollageGrid(count: number, cols: number): SpanVariant[] {
  const seedRef = useRef(Math.floor(Math.random() * 2147483647));

  return useMemo(() => {
    if (cols <= 1) return Array<SpanVariant>(count).fill("small");

    const rand = seededRandom(seedRef.current);
    const variants: SpanVariant[] = [];
    let largeCount = 0;
    let heroCount = 0;

    for (let i = 0; i < count; i++) {
      const variant = pickVariant(rand, cols, largeCount, heroCount);
      variants.push(variant);
      if (variant === "large") largeCount++;
      if (variant === "hero") heroCount++;
    }

    let totalCols = variants.reduce((s, v) => s + SPAN_MAP[v].col, 0);
    let deficit = (cols - (totalCols % cols)) % cols;

    const upgradeCandidates: SpanVariant[] = ["wide", "tall", "hero"];
    for (let i = variants.length - 1; i >= 0 && deficit > 0; i--) {
      const cur = SPAN_MAP[variants[i]].col;
      for (const candidate of upgradeCandidates) {
        const next = SPAN_MAP[candidate].col;
        const gain = next - cur;
        if (gain > 0 && gain <= deficit && next <= cols) {
          variants[i] = candidate;
          deficit -= gain;
          break;
        }
      }
    }

    return variants;
  }, [count, cols]);
}

export function getSpanStyle(variant: SpanVariant): CSSProperties {
  return {
    gridColumn: `span ${SPAN_MAP[variant].col}`,
  };
}

export type RowBlock = { kind: "row"; weights: number[] };

export type TallBlock = {
  kind: "tall";
  side: "left" | "right";
  mainWeight: number;
};

export type CollageBlock = RowBlock | TallBlock;

const ROW2: number[][] = [
  [0.50, 0.50],
  [0.42, 0.58], [0.58, 0.42],
  [0.38, 0.62], [0.62, 0.38],
  [0.45, 0.55], [0.55, 0.45],
];

const ROW3: number[][] = [
  [0.33, 0.34, 0.33],
  [0.40, 0.30, 0.30], [0.30, 0.40, 0.30], [0.30, 0.30, 0.40],
  [0.38, 0.32, 0.30], [0.30, 0.38, 0.32], [0.32, 0.30, 0.38],
];

const TALL_WEIGHTS = [0.38, 0.4, 0.42, 0.44];

function pickWeights(rand: () => number, n: number): number[] {
  const pool = n === 3 ? ROW3 : ROW2;
  return pool[Math.floor(rand() * pool.length)];
}

function pickBlockSize(rand: () => number, remaining: number): number {
  if (remaining <= 3) return remaining;
  if (remaining === 4) return 2;
  const valid = [2, 3].filter((n) => remaining - n !== 1);
  if (valid.length === 0) return 2;
  const r = rand();
  if (valid.includes(3) && r > 0.4) return 3;
  return 2;
}

function pickEqualRows(
  count: number,
  rand: () => number,
  maxPerRow: number,
): number[] {
  const rows: number[] = [];
  let rem = count;

  while (rem > 0) {
    const r = rand();
    let n: number;
    if (r < 0.22) n = 1;
    else if (r < 0.58) n = 2;
    else n = Math.min(3, maxPerRow);

    const take = Math.min(n, rem);
    rows.push(take);
    rem -= take;
  }

  return rows;
}

export function useEqualRows(count: number, maxPerRow: number): number[] {
  const seedRef = useRef(Math.floor(Math.random() * 2_147_483_647));
  return useMemo<number[]>(() => {
    if (maxPerRow <= 1) return Array<number>(count).fill(1);
    const rand = seededRandom(seedRef.current);
    return pickEqualRows(count, rand, maxPerRow);
  }, [count, maxPerRow]);
}

export function useCollageBlocks(
  count: number,
  maxPerRow: number,
): CollageBlock[] {
  const seedRef = useRef(Math.floor(Math.random() * 2_147_483_647));

  return useMemo<CollageBlock[]>(() => {
    if (maxPerRow <= 1 || count === 0) {
      return Array.from(
        { length: count },
        () => ({ kind: "row", weights: [1] }) as RowBlock,
      );
    }

    const rand = seededRandom(seedRef.current);
    const blocks: CollageBlock[] = [];
    let remaining = count;

    while (remaining > 0) {
      const canTall =
        maxPerRow >= 3 &&
        remaining >= 3 &&
        (remaining === 3 || remaining - 3 >= 2);

      if (canTall && rand() < 0.32) {
        const side: "left" | "right" = rand() < 0.5 ? "left" : "right";
        const mainWeight =
          TALL_WEIGHTS[Math.floor(rand() * TALL_WEIGHTS.length)];
        blocks.push({ kind: "tall", side, mainWeight });
        remaining -= 3;
      } else {
        const n = Math.min(pickBlockSize(rand, remaining), maxPerRow);
        blocks.push({ kind: "row", weights: pickWeights(rand, n) });
        remaining -= n;
      }
    }

    return blocks;
  }, [count, maxPerRow]);
}
