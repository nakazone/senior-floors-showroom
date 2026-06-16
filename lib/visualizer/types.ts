export type AiBackend = "webgpu" | "wasm" | "server-required";

export type InstallDirection = "horizontal" | "vertical" | "diagonal";

export type ProcessingStage =
  | "idle"
  | "capability"
  | "segmentation"
  | "perspective"
  | "rendering"
  | "ready"
  | "error";

export interface CapabilityResult {
  aiBackend: AiBackend;
  renderBackend: "webgl2";
  warmupMs: number;
}

export interface FloorMaskResult {
  maskData: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface RealWorldScale {
  /** Plank/tile width in meters (used for UV tiling density). */
  plankWidthMeters: number;
}

export interface PerspectiveResult {
  corners: [number, number][];
  homography: Float32Array;
  inverseHomography: Float32Array;
}

export interface CompositorState {
  direction: InstallDirection;
  scale: number;
  meanLuminance: number;
}

export interface VisualizerProductOption {
  id: string;
  slug: string;
  name: string;
  series: string;
  textureUrl: string;
  plankWidthMeters: number;
}
