import type { InstallDirection } from "@/lib/visualizer/types";
import { DIRECTION_ANGLES } from "@/lib/visualizer/constants";
import {
  DEBUG_MASK_FRAG,
  FLOOR_COMPOSITE_FRAG,
  FULLSCREEN_VERT,
} from "@/lib/visualizer/shaders/index";

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "Unknown link error";
    gl.deleteProgram(program);
    throw new Error(log);
  }

  return program;
}

function createTexture(
  gl: WebGL2RenderingContext,
  unit: number,
  source: TexImageSource | null,
  width: number,
  height: number,
  data: Uint8ClampedArray | null = null,
) {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Unable to create texture");

  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  if (source) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  } else if (data) {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data,
    );
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }

  return texture;
}

export class FloorCompositor {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private debugProgram: WebGLProgram;
  private photoTexture: WebGLTexture | null = null;
  private maskTexture: WebGLTexture | null = null;
  private floorTexture: WebGLTexture | null = null;
  private width = 0;
  private height = 0;
  private inverseHomography = new Float32Array(9);
  private direction: InstallDirection = "horizontal";
  private tileScale = 4;
  private meanLuminance = 0.5;
  private showOriginal = false;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) throw new Error("WebGL2 is required for the floor compositor");
    this.gl = gl;
    this.program = createProgram(gl, FULLSCREEN_VERT, FLOOR_COMPOSITE_FRAG);
    this.debugProgram = createProgram(gl, FULLSCREEN_VERT, DEBUG_MASK_FRAG);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  setPhoto(image: TexImageSource, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);

    if (this.photoTexture) this.gl.deleteTexture(this.photoTexture);
    this.photoTexture = createTexture(this.gl, 0, image, width, height);
  }

  setMask(mask: Uint8ClampedArray, width: number, height: number) {
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i += 1) {
      const value = mask[i];
      rgba[i * 4] = value;
      rgba[i * 4 + 1] = value;
      rgba[i * 4 + 2] = value;
      rgba[i * 4 + 3] = 255;
    }

    if (this.maskTexture) this.gl.deleteTexture(this.maskTexture);
    this.maskTexture = createTexture(this.gl, 1, null, width, height, rgba);
  }

  setFloorTexture(image: TexImageSource) {
    if (this.floorTexture) this.gl.deleteTexture(this.floorTexture);
    this.floorTexture = createTexture(this.gl, 2, image, 0, 0);
  }

  setInverseHomography(matrix: Float32Array) {
    this.inverseHomography.set(matrix);
  }

  setDirection(direction: InstallDirection) {
    this.direction = direction;
  }

  setTileScale(scale: number) {
    this.tileScale = scale;
  }

  setMeanLuminance(value: number) {
    this.meanLuminance = value;
  }

  setShowOriginal(show: boolean) {
    this.showOriginal = show;
  }

  render(debugMask = false) {
    const gl = this.gl;
    if (!this.photoTexture || !this.maskTexture || !this.floorTexture) return;

    const program = debugMask ? this.debugProgram : this.program;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.photoTexture);
    gl.uniform1i(gl.getUniformLocation(program, "u_originalPhoto"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
    gl.uniform1i(gl.getUniformLocation(program, "u_floorMask"), 1);

    if (!debugMask) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.floorTexture);
      gl.uniform1i(gl.getUniformLocation(program, "u_floorTexture"), 2);
      gl.uniformMatrix3fv(
        gl.getUniformLocation(program, "u_invHomography"),
        false,
        this.inverseHomography,
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_rotation"),
        DIRECTION_ANGLES[this.direction],
      );
      gl.uniform1f(gl.getUniformLocation(program, "u_tileScale"), this.tileScale);
      gl.uniform1f(
        gl.getUniformLocation(program, "u_meanLuminance"),
        this.meanLuminance,
      );
      gl.uniform2f(
        gl.getUniformLocation(program, "u_photoSize"),
        this.width,
        this.height,
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_showOriginal"),
        this.showOriginal ? 1 : 0,
      );
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  async toBlob(type = "image/png"): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Unable to export composed image"));
        else resolve(blob);
      }, type);
    });
  }

  destroy() {
    const { gl } = this;
    if (this.photoTexture) gl.deleteTexture(this.photoTexture);
    if (this.maskTexture) gl.deleteTexture(this.maskTexture);
    if (this.floorTexture) gl.deleteTexture(this.floorTexture);
    gl.deleteProgram(this.program);
    gl.deleteProgram(this.debugProgram);
  }
}
