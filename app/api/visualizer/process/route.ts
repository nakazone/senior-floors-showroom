import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-side segmentation fallback for devices that cannot run Transformers.js locally.
 * The uploaded photo is processed only for floor mask extraction and is not persisted.
 *
 * NOTE: Full ONNX/server inference can be wired here later. For now this route returns
 * a conservative lower-region heuristic mask so the consent + pipeline path can be tested.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const photo = formData.get("photo");

    if (!(photo instanceof File)) {
      return NextResponse.json({ error: "Photo file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    const dimensions = readImageDimensions(buffer);

    if (!dimensions) {
      return NextResponse.json({ error: "Unable to read image dimensions" }, { status: 400 });
    }

    const { width, height } = dimensions;
    const mask = createHeuristicFloorMask(width, height);

    return NextResponse.json({
      width,
      height,
      mask: Array.from(mask),
      mode: "heuristic-fallback",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to process photo on server",
      },
      { status: 500 },
    );
  }
}

function readImageDimensions(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length > 24 && buffer[0] === 0x89 && buffer[1] === 0x50) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }

  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      }
      offset += 2 + length;
    }
  }

  return null;
}

function createHeuristicFloorMask(width: number, height: number) {
  const mask = new Uint8ClampedArray(width * height);
  const floorTop = Math.floor(height * 0.45);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (y < floorTop) continue;

      const normalizedX = x / Math.max(width - 1, 1);
      const edgeFalloff = Math.min(normalizedX, 1 - normalizedX) * 2;
      mask[index] = edgeFalloff > 0.15 ? 255 : 0;
    }
  }

  return mask;
}
