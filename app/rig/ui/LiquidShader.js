import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFBO } from "@react-three/drei";

export default function LiquidShader() {
  const meshRef = useRef();
  const { viewport, gl } = useThree();

  const simRes = 1024;

  const velocityFBO = useFBO(simRes, simRes, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const velocityFBO2 = useFBO(simRes, simRes, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  // Mouse tracking with native events
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const velocity = useRef(new THREE.Vector2(0, 0));

  // Add native mouse event listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Convert to normalized coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Convert to 0-1 range for shader
      mouse.current.set(x * 0.5 + 0.5, y * 0.5 + 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const velocityMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocityInput: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uDissipation: { value: 0.98 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uVelocity;
        uniform vec2 uMouse;
        uniform vec2 uVelocityInput;
        uniform float uTime;
        uniform float uDissipation;
        varying vec2 vUv;
        
        void main() {
          vec2 texelSize = 1.0 / vec2(128.0);
          
          vec4 velocity = texture2D(uVelocity, vUv);
          
          float dist = distance(vUv, uMouse);
          float influence = smoothstep(0.3, 0.0, dist);
          
          velocity.xy += uVelocityInput * influence * 10.0;
          velocity.xy *= uDissipation;
          
          vec2 coord = vUv - velocity.xy * texelSize;
          velocity = mix(velocity, texture2D(uVelocity, coord), 0.9);
          
          gl_FragColor = velocity;
        }
      `,
    });
  }, []);

  const displayUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: null },
      uResolution: {
        value: new THREE.Vector2(viewport.width, viewport.height),
      },
    }),
    [viewport],
  );

  const displayVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const displayFragmentShader = `
    uniform float uTime;
    uniform sampler2D uVelocity;
    uniform vec2 uResolution;
    varying vec2 vUv;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      vec2 uv = vUv;
      
      vec4 vel = texture2D(uVelocity, uv);
      vec2 distortedUv = uv + vel.xy * 0.15;
      
      float noise1 = snoise(distortedUv * 3.0 + uTime * 0.2);
      float noise2 = snoise(distortedUv * 5.0 - uTime * 0.15);
      
      float speed = length(vel.xy);
      
      vec3 color1 = vec3(0.2, 0.4, 0.9);
      vec3 color2 = vec3(0.9, 0.3, 0.6);
      vec3 color3 = vec3(0.3, 0.9, 0.8);
      
      vec3 color = mix(color1, color2, noise1 * 0. + 0.1);
      color = mix(color, color3, noise2 * 0.5 + 0.5);
      color += vec3(speed * 3.0);
      
      float alpha = 0.4 + speed * 0.8;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const ping = useRef(true);
  const quadMesh = useRef();
  const quadCamera = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));

  // Create the quad mesh once
  useEffect(() => {
    quadMesh.current = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      velocityMaterial,
    );
  }, [velocityMaterial]);

  useFrame((state) => {
    // Calculate velocity
    velocity.current.subVectors(mouse.current, lastMouse.current);
    lastMouse.current.copy(mouse.current);

    // Update velocity simulation
    const currentVelocityFBO = ping.current ? velocityFBO : velocityFBO2;
    const targetVelocityFBO = ping.current ? velocityFBO2 : velocityFBO;

    velocityMaterial.uniforms.uVelocity.value = currentVelocityFBO.texture;
    velocityMaterial.uniforms.uMouse.value.copy(mouse.current);
    velocityMaterial.uniforms.uVelocityInput.value.copy(velocity.current);
    velocityMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    // Render velocity to target FBO
    const oldRenderTarget = gl.getRenderTarget();
    gl.setRenderTarget(targetVelocityFBO);
    gl.clear();

    if (quadMesh.current && quadCamera.current) {
      gl.render(quadMesh.current, quadCamera.current);
    }

    gl.setRenderTarget(oldRenderTarget);

    ping.current = !ping.current;

    // Update display shader
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.uVelocity.value =
        targetVelocityFBO.texture;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={9999}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        uniforms={displayUniforms}
        vertexShader={displayVertexShader}
        fragmentShader={displayFragmentShader}
        transparent={true}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
