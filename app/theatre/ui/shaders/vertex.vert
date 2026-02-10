uniform sampler2D uTexture;
uniform float uParticleSize;

varying float vVisibility;

void main() {
  // Sample alpha map (use .r for grayscale JPG, .a if texture has alpha)
  vec4 texColor = texture2D(uTexture, uv);
  float alpha = texColor.r;

  vVisibility = alpha;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Pull vertices outward near hover point when hovering

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uParticleSize * alpha * (1.0 / -viewPosition.z);
}
