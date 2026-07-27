import {
  GeometryAttribute,
  Mesh,
  PointCloud,
  Program,
  Renderer,
  Texture,
  TransformFeedback,
  Uniform,
} from 'wtc-gl'
import { Vec2 } from 'wtc-math'

/* La fotografía se vuelve arena: las partículas nacen sobre sus píxeles,
   guardan su color y recuperan otro punto de la imagen cuando mueren. */
const VERT = /* glsl */ `#version 300 es
in vec2 position;
layout(location=0) in vec4 a_posvel;
layout(location=1) in vec4 a_lifeseed;
layout(location=2) in vec3 a_color;

out vec4 v_posvel;
out vec4 v_lifeseed;
out vec3 v_color;
out float v_alpha;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_mouse_velocity;
uniform sampler2D u_image;
uniform float u_image_aspect;
uniform float u_size;

vec2 coverUv(vec2 uv) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  float scale = (u_image_aspect > canvasAspect)
    ? canvasAspect / u_image_aspect
    : u_image_aspect / canvasAspect;
  vec2 axis = (u_image_aspect > canvasAspect) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  return (uv - 0.5) * (axis * scale + (1.0 - axis)) + 0.5;
}

#define MOD3 vec3(.1031,.11369,.13787)
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * MOD3);
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3((p3.x+p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float simplexNoise(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i = floor(p + (p.x+p.y+p.z)*K1);
  vec3 d0 = p - (i - (i.x+i.y+i.z)*K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy*(1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - 2.0*K2);
  vec3 d3 = d0 - (1.0 - 3.0*K2);
  vec4 h = max(0.6 - vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)), 0.0);
  vec4 n = h*h*h*h * vec4(
    dot(d0, hash33(i)), dot(d1, hash33(i+i1)),
    dot(d2, hash33(i+i2)), dot(d3, hash33(i+1.0))
  );
  return dot(vec4(31.316), n);
}

void main() {
  vec2 position = a_posvel.xy;
  vec2 velocity = a_posvel.zw;
  float life = a_lifeseed.x + 1.0;
  float maxLife = a_lifeseed.y;
  vec2 seed = a_lifeseed.zw;

  float angle = simplexNoise(vec3(position * 0.004, u_time * 20.0 + life * .05)) * 6.2831;
  vec2 noiseForce = vec2(cos(angle), sin(angle)) * 0.04;
  vec2 toMouse = position - u_mouse;
  float proximity = 1000.0 / (dot(toMouse, toMouse) + 1000.0);
  vec2 mouseForce = u_mouse_velocity * proximity * 0.055;

  velocity = velocity * 0.98 + noiseForce + mouseForce;
  position += velocity;
  v_posvel = vec4(position, velocity);
  v_lifeseed = vec4(life, maxLife, seed);
  v_color = a_color;

  bool dead = life >= maxLife || position.x < 0.0 || position.x > u_resolution.x ||
    position.y < 0.0 || position.y > u_resolution.y;
  if (dead) {
    vec3 h = hash33(vec3(seed, u_time + life));
    vec2 uv = fract(h.xy * .5 + .5);
    v_posvel = vec4(uv * u_resolution, 0.0, 0.0);
    v_lifeseed = vec4(0.0, maxLife, h.xy);
    v_color = texture(u_image, coverUv(uv)).rgb;
  }

  float ratio = v_lifeseed.x / maxLife;
  float alpha = smoothstep(0.0, .05, ratio) * (1.0 - smoothstep(.85, 1.0, ratio));
  gl_PointSize = smoothstep(1.0, .5, ratio) * u_size * alpha;
  v_alpha = alpha * .48;
  vec2 ndc = v_posvel.xy / u_resolution * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
}`

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec3 v_color;
in float v_alpha;
out vec4 fragColor;
void main() {
  float dist = length(gl_PointCoord - .5);
  float shape = 1.0 - smoothstep(.28, .5, dist);
  fragColor = vec4(v_color, v_alpha * shape);
}`

type Options = {
  container: HTMLElement
  image: HTMLImageElement
  particles?: number
}

export class DesertParticles {
  #playing = false
  #visible = true
  #last = 0

  private renderer: Renderer
  private gl: Renderer['gl']
  private mesh: Mesh | null = null
  private observer: IntersectionObserver | null = null
  private resizeObserver: ResizeObserver | null = null
  private rebuildTimeout = 0
  private targetMouse: [number, number] = [-10000, -10000]
  private lastMouse: [number, number] = [-10000, -10000]
  private mouseVelocity: [number, number] = [0, 0]
  private uTime = new Uniform({ name: 'u_time', value: 0, kind: 'float' })
  private uResolution = new Uniform({ name: 'u_resolution', value: [1, 1], kind: 'float_vec2' })
  private uMouse = new Uniform({ name: 'u_mouse', value: [-10000, -10000], kind: 'float_vec2' })
  private uMouseVelocity = new Uniform({ name: 'u_mouse_velocity', value: [0, 0], kind: 'float_vec2' })
  private uSize = new Uniform({ name: 'u_size', value: 2, kind: 'float' })

  constructor(private options: Options) {
    this.renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 1.5), alpha: true })
    this.gl = this.renderer.gl
    if (!this.renderer.isWebgl2) {
      ;(this.gl.canvas as HTMLCanvasElement).remove()
      throw new Error('DesertParticles necesita WebGL2')
    }

    this.gl.depthMask(false)
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.clearColor(0, 0, 0, 0)
    const canvas = this.gl.canvas as HTMLCanvasElement
    canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;inset:0;'
    options.container.appendChild(canvas)

    this.render = this.render.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerLeave = this.onPointerLeave.bind(this)
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', this.onPointerLeave)

    this.observer = new IntersectionObserver(([entry]) => { this.#visible = entry.isIntersecting }, { rootMargin: '10%' })
    this.observer.observe(options.container)
    this.resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(this.rebuildTimeout)
      this.rebuildTimeout = window.setTimeout(() => this.build(), 180)
    })
    this.resizeObserver.observe(options.container)
    this.build()
    this.playing = true
  }

  private build() {
    const { container, image, particles = 140000 } = this.options
    const w = container.clientWidth
    const h = container.clientHeight
    if (w < 2 || h < 2 || !image.naturalWidth) return

    this.renderer.dimensions = new Vec2(w, h)
    const dpr = this.renderer.dpr
    const pw = Math.round(w * dpr)
    const ph = Math.round(h * dpr)
    this.uResolution.value = [pw, ph]
    this.uSize.value = Math.max(2.1, dpr * 2)

    const texture = new Texture(this.gl, { generateMipmaps: false, minFilter: this.gl.LINEAR, magFilter: this.gl.LINEAR, wrapS: this.gl.CLAMP_TO_EDGE, wrapT: this.gl.CLAMP_TO_EDGE, flipY: false })
    texture.image = image
    texture.needsUpdate = true
    const imageAspect = image.naturalWidth / image.naturalHeight
    const total = Math.min(particles, Math.round(pw * ph * .085))
    const posvel = new Float32Array(total * 4)
    const lifeSeed = new Float32Array(total * 4)
    const color = new Float32Array(total * 3)
    const sample = document.createElement('canvas')
    sample.width = image.naturalWidth
    sample.height = image.naturalHeight
    const ctx = sample.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(image, 0, 0)
    const data = ctx.getImageData(0, 0, sample.width, sample.height).data
    const canvasAspect = pw / ph

    for (let i = 0; i < total; i++) {
      const x = Math.random() * pw
      const y = Math.random() * ph
      const life = 110 + Math.random() * 280
      let u = x / pw
      let v = y / ph
      if (imageAspect > canvasAspect) u = (u - .5) * (canvasAspect / imageAspect) + .5
      else v = (v - .5) * (imageAspect / canvasAspect) + .5
      const px = Math.min(Math.floor(Math.max(0, Math.min(1, u)) * sample.width), sample.width - 1)
      const py = Math.min(Math.floor(Math.max(0, Math.min(1, v)) * sample.height), sample.height - 1)
      const pixel = (py * sample.width + px) * 4
      posvel.set([x, y, (Math.random() - .5) * .5, (Math.random() - .5) * .5], i * 4)
      lifeSeed.set([Math.random() * life, life, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 4)
      color.set([data[pixel] / 255, data[pixel + 1] / 255, data[pixel + 2] / 255], i * 3)
    }

    const program = new Program(this.gl, {
      vertex: VERT, fragment: FRAG, transparent: true, depthTest: false,
      uniforms: { u_time: this.uTime, u_resolution: this.uResolution, u_mouse: this.uMouse, u_mouse_velocity: this.uMouseVelocity, u_image: new Uniform({ name: 'u_image', value: texture, kind: 'texture' }), u_image_aspect: new Uniform({ name: 'u_image_aspect', value: imageAspect, kind: 'float' }), u_size: this.uSize },
      transformFeedbackVaryings: ['v_posvel', 'v_lifeseed', 'v_color'],
    })
    const feedback = new TransformFeedback(this.gl, {
      program: program.program as unknown as Program,
      transformFeedbacks: {
        a_posvel: { data: posvel, size: 4, usage: this.gl.STREAM_COPY, varying: 'v_posvel' },
        a_lifeseed: { data: lifeSeed, size: 4, usage: this.gl.STREAM_COPY, varying: 'v_lifeseed' },
        a_color: { data: color, size: 3, usage: this.gl.STREAM_COPY, varying: 'v_color' },
      },
    })
    const cloud = new PointCloud(this.gl, {
      particles: total, dimensions: 2,
      fillFunction: points => { for (let i = 0; i < total; i++) { points[i * 2] = posvel[i * 4]; points[i * 2 + 1] = posvel[i * 4 + 1] } },
      attributes: { a_posvel: new GeometryAttribute({ size: 4, data: posvel }), a_lifeseed: new GeometryAttribute({ size: 4, data: lifeSeed }), a_color: new GeometryAttribute({ size: 3, data: color }) },
      transformFeedbacks: feedback,
    })
    this.mesh = new Mesh(this.gl, { mode: this.gl.POINTS, geometry: cloud, program })
  }

  private onPointerMove(event: PointerEvent) {
    const rect = (this.gl.canvas as HTMLCanvasElement).getBoundingClientRect()
    const dpr = this.renderer.dpr
    if (this.targetMouse[0] < -9000) this.lastMouse = [(event.clientX - rect.left) * dpr, (event.clientY - rect.top) * dpr]
    this.targetMouse = [(event.clientX - rect.left) * dpr, (event.clientY - rect.top) * dpr]
    this.uMouse.value = this.targetMouse
  }

  private onPointerLeave() {
    const away = -10000 * this.renderer.dpr
    this.targetMouse = [away, away]
    this.lastMouse = [away, away]
    this.mouseVelocity = [0, 0]
    this.uMouse.value = this.targetMouse
  }

  private render(time: number) {
    const delta = time - this.#last
    this.#last = time
    if (this.#playing) requestAnimationFrame(this.render)
    if (!this.mesh || !this.#visible || !delta) return
    this.uTime.value = (this.uTime.value as number) + delta * .00005
    const vx = this.targetMouse[0] - this.lastMouse[0]
    const vy = this.targetMouse[1] - this.lastMouse[1]
    this.mouseVelocity[0] += (vx - this.mouseVelocity[0]) * .15
    this.mouseVelocity[1] += (vy - this.mouseVelocity[1]) * .15
    this.lastMouse = [...this.targetMouse]
    this.uMouseVelocity.value = this.mouseVelocity
    this.renderer.render({ scene: this.mesh, update: true, sort: false, frustumCull: false })
  }

  set playing(value: boolean) {
    if (!this.#playing && value) { this.#playing = true; this.#last = 0; requestAnimationFrame(this.render) }
    else if (!value) this.#playing = false
  }

  destroy() {
    this.#playing = false
    window.clearTimeout(this.rebuildTimeout)
    ;(this.gl.canvas as HTMLCanvasElement).removeEventListener('pointermove', this.onPointerMove)
    ;(this.gl.canvas as HTMLCanvasElement).removeEventListener('pointerleave', this.onPointerLeave)
    this.observer?.disconnect()
    this.resizeObserver?.disconnect()
    ;(this.gl.canvas as HTMLCanvasElement).remove()
  }
}
