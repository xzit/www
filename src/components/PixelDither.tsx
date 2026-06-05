"use client";

import { useCallback, useEffect, useRef } from "react";

// ============================================
// SHADERS WEBGL - Copiados del original de monokai.com
// ============================================

const vertexShaderSource = `#version 300 es
precision highp float;

in vec2 uv;
in vec2 position;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform float uScroll;
uniform float uDitherSize;
uniform float uOffset;
uniform float uSeed;
uniform vec2 uResolution;
uniform vec2 uRegionX;
uniform vec2 uRegionY;
uniform vec2 uBlockSize;
uniform vec2 uNumBlocks;
uniform vec3 uColor;

int patterns[8] = int[](0, 0, 13, 7, 5, 10, 2, 8);

in vec2 vUv;
out vec4 result;

float noise1d(float x) {
  float i = floor(x);
  float f = fract(x);
  float s = sign(fract(x * 0.5) - 0.5);
  float k = fract(i * 0.1731);
  return s * f * (f - 1.0) * ((16.0 * k - 4.0) * f * (f - 1.0) - 1.0);
}

uint hash21(uvec2 p) {
  p *= uvec2(73333u, 7777u);
  p ^= (uvec2(3333777777u) >> (p >> 28u));
  uint n = p.x * p.y;
  return n ^ (n >> 15u);
}

void main() {
  vec2 uv = vUv;
  vec4 clr = vec4(0);
  vec2 pos = uv * uResolution;
  vec2 blockSize = uBlockSize;

  float sx = noise1d(uv.x * 4.0 + uSeed) * 0.4 + 0.6;

  blockSize.x = ceil(blockSize.x * sx / uDitherSize) * uDitherSize;
  blockSize.y = ceil(blockSize.y * sx / uDitherSize) * uDitherSize;

  float scroll = uScroll * (1.0 - (blockSize.x / uBlockSize.x) * 0.85) * 0.75;

  float offset = mod(scroll, blockSize.y);

  vec2 posf = vec2(
    floor(pos.x / blockSize.x) * blockSize.x,
    floor((pos.y - scroll) / blockSize.y) * blockSize.y
  );

  float h = mix(1.0, 1.5, noise1d(uv.x * 3.0 + uSeed) * 0.5 + 0.5);

  float v2 = (posf.y + scroll) / uResolution.y + uOffset;

  float v = float(hash21(uvec2(mod(posf, uResolution.y * 256.0)))) / float(0xffffffffu) - v2 * (2.0 + 2.0 / uNumBlocks.y) * h + 0.5 + 1.0 / h * 0.5;

  vec2 ditherPos = vec2(
    floor((pos.x - posf.x) / uDitherSize) * uDitherSize,
    floor(mod((pos.y - scroll - posf.y), uResolution.y) / uDitherSize) * uDitherSize
  );

  uint fade = uint((1.0 - v) * 4.0);

  bool hasPixel = fade == 0U || (patterns[fade * 2U + uint(ditherPos.y / uDitherSize) % 2U] & (1 << (uint(ditherPos.x / uDitherSize) % 4U))) > 0;

  if (
    pos.x >= uRegionX.x && pos.x <= uRegionX.y
    && (1.0 - uv.y) * uResolution.y >= uRegionY.x
    && (1.0 - uv.y) * uResolution.y <= uRegionY.y
    && v > 0.0
    && hasPixel
  ) {
    clr = vec4(uColor, 1);
  }

  result = clr;
}`;

// ============================================
// UTILIDADES WEBGL
// ============================================

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[v0] Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[v0] Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [1, 1, 1];
}

// ============================================
// COMPONENTE PRINCIPAL DEL EFECTO
// ============================================

interface PixelDitherEffectProps {
  color?: string;
  height?: number;
  blockSize?: [number, number, number]; // [blockWidth, blockHeight, ditherSize]
}

export function PixelDitherEffect({
  color = "#ffffff",
  height = 72,
  blockSize = [9, 12, 3],
}: PixelDitherEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const animationRef = useRef<number>(0);
  const seedRef = useRef(Math.random() * 999);

  // Inicializar WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      console.error("[v0] WebGL2 not supported");
      return false;
    }

    glRef.current = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    if (!vertexShader || !fragmentShader) return false;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return false;

    programRef.current = program;

    // Crear geometría (triángulo que cubre toda la pantalla)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // UV buffer
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 2, 0, 0, 2]),
      gl.STATIC_DRAW,
    );

    const uvLoc = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // Obtener ubicaciones de uniforms
    uniformsRef.current = {
      uScroll: gl.getUniformLocation(program, "uScroll"),
      uDitherSize: gl.getUniformLocation(program, "uDitherSize"),
      uOffset: gl.getUniformLocation(program, "uOffset"),
      uSeed: gl.getUniformLocation(program, "uSeed"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uRegionX: gl.getUniformLocation(program, "uRegionX"),
      uRegionY: gl.getUniformLocation(program, "uRegionY"),
      uBlockSize: gl.getUniformLocation(program, "uBlockSize"),
      uNumBlocks: gl.getUniformLocation(program, "uNumBlocks"),
      uColor: gl.getUniformLocation(program, "uColor"),
    };

    gl.useProgram(program);

    // Configurar blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    console.log("[v0] WebGL initialized successfully");
    return true;
  }, []);

  // Renderizar
  const render = useCallback(
    (scrollY: number) => {
      const gl = glRef.current;
      const program = programRef.current;
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const uniforms = uniformsRef.current;

      if (!gl || !program || !container || !canvas) {
        console.log("[v0] Render skipped - missing refs", {
          gl: !!gl,
          program: !!program,
          container: !!container,
          canvas: !!canvas,
        });
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = container.offsetWidth;
      const canvasHeight = height;

      // Ajustar tamaño del canvas
      const newWidth = Math.floor(width * dpr);
      const newHeight = Math.floor(canvasHeight * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${canvasHeight}px`;
        gl.viewport(0, 0, newWidth, newHeight);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      const numBlocksX = Math.ceil(width / blockSize[0]);
      const numBlocksY = Math.ceil(canvasHeight / blockSize[1]);
      const rgb = hexToRgb(color);

      // Establecer uniforms
      gl.uniform1f(uniforms.uScroll, -scrollY * dpr);
      gl.uniform1f(uniforms.uDitherSize, blockSize[2]);
      gl.uniform1f(uniforms.uOffset, 0);
      gl.uniform1f(uniforms.uSeed, seedRef.current);
      gl.uniform2f(uniforms.uResolution, newWidth, newHeight);
      gl.uniform2f(uniforms.uRegionX, 0, newWidth);
      gl.uniform2f(uniforms.uRegionY, 0, newHeight);
      gl.uniform2f(uniforms.uBlockSize, blockSize[0] * dpr, blockSize[1] * dpr);
      gl.uniform2f(uniforms.uNumBlocks, numBlocksX, numBlocksY);
      gl.uniform3f(uniforms.uColor, rgb[0], rgb[1], rgb[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    [color, height, blockSize],
  );

  // Inicializar
  useEffect(() => {
    const success = initWebGL();
    console.log("[v0] initWebGL result:", success);
    if (success) {
      render(window.scrollY);
    }

    return () => {
      const gl = glRef.current;
      const program = programRef.current;
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [initWebGL, render]);

  // Manejar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(() => {
        render(window.scrollY);
      });
    };

    const handleResize = () => {
      render(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-50"
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
