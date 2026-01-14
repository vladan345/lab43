varying vec2 vUv;
#ifdef USE_FOG
varying float vFogDepth;
#endif

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;

  #ifdef USE_FOG
  vFogDepth = -viewPosition.z;
  #endif

  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
}
