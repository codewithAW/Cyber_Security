/** GLSL shaders for the morphing particles and the background starfield. */

export const particleVertex = /* glsl */ `
  attribute vec3 color;
  attribute float aSize;
  attribute float aRand;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  uniform float uTwinkle;
  uniform float uIsLight;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 1.0 - uTwinkle * 0.5 * (0.5 + 0.5 * sin(uTime * (1.2 + aRand * 3.5) + aRand * 61.0));
    vAlpha = tw;
    
    if (uIsLight > 0.5) {
      vec3 sat = color;
      if (sat.b > sat.r) {
        sat = mix(sat, vec3(0.01, 0.42, 0.86), 0.55);
      } else {
        sat = mix(sat, vec3(0.92, 0.36, 0.04), 0.55);
      }
      vColor = sat;
    } else {
      vColor = color;
    }
    
    gl_PointSize = aSize * uSizeScale * uPixelRatio / -mv.z;
  }
`;

export const particleFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uIsLight;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    if (d > 0.5) discard;
    float core = smoothstep(0.2, 0.0, d);
    float glow = exp(-d * d * 26.0);
    
    if (uIsLight > 0.5) {
      float a = (core * 0.96 + glow * 0.45) * vAlpha * uOpacity;
      vec3 col = vColor * (0.92 + core * 0.15);
      gl_FragColor = vec4(col, a);
    } else {
      float a = (core * 0.95 + glow * 0.32) * vAlpha * uOpacity;
      vec3 col = vColor * (1.15 + core * 0.6);
      gl_FragColor = vec4(col, a);
    }
  }
`;

export const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aRand;
  attribute vec3 color;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform float uDrift;
  varying vec3 vColor;
  varying float vAlpha;
  const float NEAR = 6.0;
  const float FAR = -90.0;
  void main() {
    vec3 p = position;
    // slow forward drift, wrapping through the depth range
    p.z = mod(p.z - FAR + uTime * uDrift * (0.4 + aRand * 0.6), NEAR - FAR) + FAR;
    float depth = clamp((p.z - FAR) / (NEAR - FAR), 0.0, 1.0); // 0 far .. 1 near
    float par = depth * depth;
    p.y += uScroll * (1.5 + par * 16.0);
    p.x += uMouse.x * (0.3 + par * 2.4);
    p.y += uMouse.y * (0.3 + par * 1.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aRand * 2.4) + aRand * 90.0);
    float fadeNear = smoothstep(NEAR, NEAR - 6.0, p.z);
    float fadeFar = smoothstep(FAR, FAR + 15.0, p.z);
    vAlpha = tw * fadeNear * fadeFar;
    vColor = color;
    gl_PointSize = aSize * uPixelRatio * (30.0 / max(1.0, -mv.z)) + 0.6 * uPixelRatio;
  }
`;

export const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = (smoothstep(0.5, 0.0, d) * 0.6 + smoothstep(0.15, 0.0, d)) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;
