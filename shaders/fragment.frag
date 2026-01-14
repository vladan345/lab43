#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

varying vec2 vUv;
#ifdef USE_FOG
varying float vFogDepth;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
#endif

uniform sampler2D uTexture;
uniform float uIntensity;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );
  return res * res;
}

void main() {
  float distortion = noise(vUv * 10.0) * 1.0 * uIntensity;
  vec2 distortedPosition = fract(
    vec2(uIntensity * 0.5, 0.0) + vec2(vUv.x + distortion, vUv.y)
  );
  vec4 texture = texture2D(uTexture, distortedPosition);

  #ifdef USE_FOG
  // Calculate fog factor
  float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
  texture.rgb = mix(texture.rgb, fogColor, fogFactor);
  #endif

  gl_FragColor = texture;
}
