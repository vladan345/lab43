uniform vec3 uAtmosphereColor;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  // Fresnel: rim glow at edges, transparent at center
  float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);
  float alpha = fresnel;

  gl_FragColor = vec4(uAtmosphereColor, alpha);
  #include <colorspace_fragment>
}
