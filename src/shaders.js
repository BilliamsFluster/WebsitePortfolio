export const NighttimeShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "amount":   { value: 0.5 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform float amount;",
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
      "vec4 color = texture2D( tDiffuse, vUv );",
      "vec3 c = color.rgb * (1.0 - amount);",

      // fog effect
      "float fogDepth = gl_FragCoord.z / gl_FragCoord.w;",
      "float fogFactor = smoothstep(50.0, 100.0, fogDepth);",
      "vec3 fogColor = mix(vec3(0.8, 0.1, 0.9), vec3(0.2, 0.1, 0.9), vUv.y);", 

      // mix original color, fog color and darken
      "c = mix(c, fogColor, fogFactor);",
      "gl_FragColor = vec4(c, color.a);",
    "}"
  ].join("\n")
};
