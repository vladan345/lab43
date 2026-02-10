varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;

  vNormal = normalize(normalMatrix * normal);
  vViewPosition = -viewPosition.xyz;

  gl_Position = projectionMatrix * viewPosition;
}
