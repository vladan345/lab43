uniform vec3 uParticleColor;

varying float vVisibility;

void main() {
  // Discard invisible particles (backup for gl_PointSize = 0)
  if (vVisibility < 0.5) discard;
  //   vec2 center = gl_PointCoord - 0.5;
  //   if (length(center) > 0.5) discard;

  float lengthCenter = 1.0 - length(gl_PointCoord - 0.5);
  lengthCenter = pow(smoothstep(0.5, 1.2, lengthCenter), 2.0);
  gl_FragColor = vec4(uParticleColor, lengthCenter);
  #include <colorspace_fragment>
}
