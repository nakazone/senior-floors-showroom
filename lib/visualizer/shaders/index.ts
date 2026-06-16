export const FULLSCREEN_VERT = `#version 300 es
precision highp float;

const vec2 positions[6] = vec2[6](
  vec2(-1.0, -1.0),
  vec2(1.0, -1.0),
  vec2(-1.0, 1.0),
  vec2(-1.0, 1.0),
  vec2(1.0, -1.0),
  vec2(1.0, 1.0)
);

const vec2 uvs[6] = vec2[6](
  vec2(0.0, 1.0),
  vec2(1.0, 1.0),
  vec2(0.0, 0.0),
  vec2(0.0, 0.0),
  vec2(1.0, 1.0),
  vec2(1.0, 0.0)
);

out vec2 v_uv;

void main() {
  v_uv = uvs[gl_VertexID];
  gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}
`;

export const FLOOR_COMPOSITE_FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_originalPhoto;
uniform sampler2D u_floorMask;
uniform sampler2D u_floorTexture;
uniform mat3 u_invHomography;
uniform float u_rotation;
uniform float u_tileScale;
uniform float u_meanLuminance;
uniform vec2 u_photoSize;
uniform float u_showOriginal;

vec2 rotateUV(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  uv -= 0.5;
  uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
  uv += 0.5;
  return uv;
}

vec3 applyHomography(vec2 pixelCoord) {
  vec3 mapped = u_invHomography * vec3(pixelCoord, 1.0);
  return mapped;
}

void main() {
  vec4 original = texture(u_originalPhoto, v_uv);

  if (u_showOriginal > 0.5) {
    fragColor = original;
    return;
  }

  float maskVal = texture(u_floorMask, v_uv).r;
  float feather = smoothstep(0.35, 0.55, maskVal);

  if (feather < 0.001) {
    fragColor = original;
    return;
  }

  vec2 pixelCoord = v_uv * u_photoSize;
  vec3 h = applyHomography(pixelCoord);
  vec2 texUV = h.xy / max(h.z, 1e-6);

  texUV = rotateUV(texUV, u_rotation);
  texUV *= u_tileScale;
  texUV = fract(texUV);

  vec4 floorTex = texture(u_floorTexture, texUV);

  float lum = dot(original.rgb, vec3(0.299, 0.587, 0.114));
  float lumFactor = u_meanLuminance > 0.001 ? lum / u_meanLuminance : 1.0;
  lumFactor = clamp(lumFactor, 0.3, 1.7);

  vec3 floorColor = floorTex.rgb * lumFactor;
  vec3 finalRgb = mix(original.rgb, floorColor, feather);
  fragColor = vec4(finalRgb, 1.0);
}
`;

export const DEBUG_MASK_FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_originalPhoto;
uniform sampler2D u_floorMask;

void main() {
  vec4 original = texture(u_originalPhoto, v_uv);
  float maskVal = texture(u_floorMask, v_uv).r;
  vec3 overlay = mix(original.rgb, vec3(1.0, 0.2, 0.2), maskVal * 0.55);
  fragColor = vec4(overlay, 1.0);
}
`;
