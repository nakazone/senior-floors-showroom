import type { PerspectiveResult } from "@/lib/visualizer/types";
import { MASK_THRESHOLD } from "@/lib/visualizer/constants";

type Point = [number, number];

function solveLinearSystem(matrix: number[][], values: number[]): number[] {
  const n = values.length;
  const augmented = matrix.map((row, index) => [...row, values[index]]);

  for (let col = 0; col < n; col += 1) {
    let pivotRow = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivotRow][col])) {
        pivotRow = row;
      }
    }

    if (Math.abs(augmented[pivotRow][col]) < 1e-10) {
      throw new Error("Singular matrix in homography computation");
    }

    if (pivotRow !== col) {
      [augmented[col], augmented[pivotRow]] = [augmented[pivotRow], augmented[col]];
    }

    const pivot = augmented[col][col];
    for (let j = col; j <= n; j += 1) {
      augmented[col][j] /= pivot;
    }

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = augmented[row][col];
      for (let j = col; j <= n; j += 1) {
        augmented[row][j] -= factor * augmented[col][j];
      }
    }
  }

  return augmented.map((row) => row[n]);
}

/** DLT homography (h33 = 1) mapping src ? dst. Returns 3x3 row-major. */
export function computeHomography(
  srcPoints: Point[],
  dstPoints: Point[],
): Float32Array {
  if (srcPoints.length !== 4 || dstPoints.length !== 4) {
    throw new Error("Homography requires exactly 4 point pairs");
  }

  const matrix: number[][] = [];
  const values: number[] = [];

  for (let i = 0; i < 4; i += 1) {
    const [sx, sy] = srcPoints[i];
    const [dx, dy] = dstPoints[i];

    matrix.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]);
    values.push(dx);
    matrix.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]);
    values.push(dy);
  }

  const [h11, h12, h13, h21, h22, h23, h31, h32] = solveLinearSystem(matrix, values);

  return new Float32Array([h11, h12, h13, h21, h22, h23, h31, h32, 1]);
}

export function invertHomography(h: Float32Array): Float32Array {
  const [a, b, c, d, e, f, g, hVal, i] = h;

  const A = e * i - f * hVal;
  const B = -(d * i - f * g);
  const C = d * hVal - e * g;
  const D = -(b * i - c * hVal);
  const E = a * i - c * g;
  const F = -(a * hVal - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;

  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-10) {
    throw new Error("Homography matrix is not invertible");
  }

  const invDet = 1 / det;
  return new Float32Array([
    A * invDet,
    D * invDet,
    G * invDet,
    B * invDet,
    E * invDet,
    H * invDet,
    C * invDet,
    F * invDet,
    I * invDet,
  ]);
}

function findMaskBounds(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (mask[y * width + x] >= MASK_THRESHOLD) {
        found = true;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!found) return null;
  return { minX, minY, maxX, maxY };
}

function closestMaskPointToTarget(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  target: Point,
): Point {
  const [tx, ty] = target;
  let best: Point = target;
  let bestDist = Number.POSITIVE_INFINITY;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (mask[y * width + x] < MASK_THRESHOLD) continue;
      const dx = x - tx;
      const dy = y - ty;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = [x, y];
      }
    }
  }

  return best;
}

export function extractFloorCorners(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
): Point[] {
  const bounds = findMaskBounds(mask, width, height);
  if (!bounds) {
    throw new Error("No floor region detected in segmentation mask");
  }

  const { minX, minY, maxX, maxY } = bounds;
  const targets: Point[] = [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ];

  return targets.map((target) =>
    closestMaskPointToTarget(mask, width, height, target),
  );
}

export function computeFloorPerspective(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
): PerspectiveResult {
  const corners = extractFloorCorners(mask, width, height);
  const srcPoints: Point[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const homography = computeHomography(srcPoints, corners);
  const inverseHomography = invertHomography(homography);

  return { corners, homography, inverseHomography };
}
