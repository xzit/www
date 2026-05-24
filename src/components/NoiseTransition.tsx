"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform vec2  uRes;
  uniform float uTime;
  uniform float uSeed;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform float uCols;
  uniform float uRows;
  uniform float uDrip;
  uniform float uNoise;
  uniform float uBand;

  float hash(vec2 p, float s) {
    return fract(sin(dot(p, vec2(12.9898, 78.233)) + s) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    uv.y = 1.0 - uv.y;

    float baseRnd    = hash(vec2(floor(uv.x * uCols) / uCols), uSeed);
    float actualCols = uRows + floor(pow(baseRnd, 2.0) * uDrip);
    float colRnd     = hash(vec2(floor(uv.x * actualCols) / actualCols), uSeed);

    float clump = 1.0 + pow((uDrip + 1.0) / actualCols, 0.125);
    clump += hash(
      vec2(floor((actualCols > uDrip ? uv.y : uv.x) * actualCols) / actualCols),
      uSeed
    );

    float threshold   = colRnd / clump;
    float noiseOffset = pow(hash(uv, 0.0), 0.25) * uNoise
                      * (0.5 + actualCols / (uRows + uDrip) * 0.5)
                      * pow(actualCols / (uRows + uDrip), 0.25);

    // uBand comprime la banda de transición: 1.0 = todo el alto, 0.1 = franja delgada
    float edge  = (uTime - threshold * uBand) * (clump + uNoise) / uBand - noiseOffset;
    vec3  color = (1.0 - edge) < uv.y ? uColor2 : uColor1;
    gl_FragColor = vec4(color, 1.0);
  }
`;

type RGB = [number, number, number];

interface NoiseTransitionProps {
  colorFrom: string;
  colorTo: string;
  height?: number;
  band?: number;
  cols?: number;
  rows?: number;
  drip?: number;
  noise?: number;
  className?: string;
  children?: React.ReactNode;
}

function hexToRGB(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function NoiseTransition({
  colorFrom,
  colorTo,
  height = 300,
  band = 1.0,
  cols = 36,
  rows = 4,
  drip = 8,
  noise = 0.5,
  className,
  children,
}: NoiseTransitionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    gl: null as WebGLRenderingContext | null,
    prog: null as WebGLProgram | null,
    uniforms: {} as Record<string, WebGLUniformLocation | null>,
    raf: 0,
    seed: Math.random() * 65536,
    W: 0,
    H: 0,
    active: false,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const s = stateRef.current;
    const gl = (canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;
    s.gl = gl;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return sh;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    s.prog = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    s.uniforms = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      seed: gl.getUniformLocation(prog, "uSeed"),
      c1: gl.getUniformLocation(prog, "uColor1"),
      c2: gl.getUniformLocation(prog, "uColor2"),
      cols: gl.getUniformLocation(prog, "uCols"),
      rows: gl.getUniformLocation(prog, "uRows"),
      drip: gl.getUniformLocation(prog, "uDrip"),
      noise: gl.getUniformLocation(prog, "uNoise"),
      band: gl.getUniformLocation(prog, "uBand"),
    };

    const c1 = hexToRGB(colorFrom);
    const c2 = hexToRGB(colorTo);

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      s.W = Math.floor(canvas!.clientWidth * dpr);
      s.H = Math.floor(canvas!.clientHeight * dpr);
      canvas!.width = s.W;
      canvas!.height = s.H;
      gl!.viewport(0, 0, s.W, s.H);
    }

    function getProgress(): number {
      if (!wrap) return 0;
      const rect = wrap.getBoundingClientRect();
      const wh = window.innerHeight;
      const raw = 1 - rect.bottom / (wh + rect.height);
      return Math.max(0, Math.min(1, raw));
    }

    function loop() {
      if (!s.active) return;
      const { gl, uniforms: u, W, H, seed } = s;
      if (!gl) return;

      const t = easeInOut(getProgress());

      // Todos los uniforms ANTES de drawArrays
      gl.uniform2f(u.res, W, H);
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.seed, seed);
      gl.uniform3fv(u.c1, c1);
      gl.uniform3fv(u.c2, c2);
      gl.uniform1f(u.cols, cols);
      gl.uniform1f(u.rows, rows);
      gl.uniform1f(u.drip, drip);
      gl.uniform1f(u.noise, noise);
      gl.uniform1f(u.band, band);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      s.raf = requestAnimationFrame(loop);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        s.active = entry.isIntersecting;
        if (s.active) {
          cancelAnimationFrame(s.raf);
          resize();
          s.raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 },
    );
    observer.observe(wrap);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();

    return () => {
      s.active = false;
      cancelAnimationFrame(s.raf);
      observer.disconnect();
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [colorFrom, colorTo, cols, rows, drip, noise, band]);

  return (
    <section
      ref={wrapRef}
      className={className}
      style={{
        height,
        minHeight: "100vh",
        background: colorFrom,
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        aria-hidden="true"
      />
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}
