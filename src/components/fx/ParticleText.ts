import {
  Renderer,
  Program,
  Mesh,
  Uniform,
  PointCloud,
  GeometryAttribute,
  TransformFeedback,
} from 'wtc-gl'
import { Vec2 } from 'wtc-math'

/* ---------------------------------------------------------------------------
   Una frase dibujada con partículas.

   El texto se rasteriza en un lienzo aparte y de él se saca la lista de píxeles
   pintados. Cada partícula adopta uno de esos píxeles como su casa: nace ahí,
   la arrastra un campo de ruido, y cuando se agota o sale de cuadro vuelve a
   su casa. Por eso la frase no se deshace nunca del todo — se lee mientras el
   polvo se mueve.

   El movimiento y la inercia del ratón son la adaptación del ejemplo que pasó
   Sergio (campo de ruido simplex + empuje por velocidad del puntero). Lo que
   cambia es el origen: allí las partículas nacían en cualquier punto de la
   pantalla y tomaban el color de una fotografía; aquí nacen sólo sobre las
   letras.
--------------------------------------------------------------------------- */

const VERT = /* glsl */ `#version 300 es

in vec2 position;
layout(location=0) in vec4 a_posvel;
layout(location=1) in vec4 a_lifeseed;
layout(location=2) in vec3 a_color;
layout(location=3) in vec2 a_home;

out vec4 v_posvel;
out vec4 v_lifeseed;
out vec3 v_color;
out vec2 v_home;
out float v_alpha;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_mouse_velocity;
uniform float u_size;

#define MOD3 vec3(.1031,.11369,.13787)
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * MOD3);
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3((p3.x+p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float simplex_noise(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i  = floor(p + (p.x+p.y+p.z)*K1);
  vec3 d0 = p - (i - (i.x+i.y+i.z)*K2);
  vec3 e  = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy*(1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - 2.0*K2);
  vec3 d3 = d0 - (1.0 - 3.0*K2);
  vec4 h = max(0.6 - vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)), 0.0);
  vec4 n = h*h*h*h * vec4(
    dot(d0, hash33(i)),
    dot(d1, hash33(i+i1)),
    dot(d2, hash33(i+i2)),
    dot(d3, hash33(i+1.0))
  );
  return dot(vec4(31.316), n);
}

void main() {
  vec2  posicion = a_posvel.xy;
  vec2  velocidad = a_posvel.zw;
  float vida     = a_lifeseed.x + 1.0;
  float vidaMax  = a_lifeseed.y;
  vec2  semilla  = a_lifeseed.zw;

  float angulo = simplex_noise(vec3(posicion * 0.004, u_time*20. + vida*.05)) * 6.2831;
  vec2  fuerzaRuido = vec2(cos(angulo), sin(angulo)) * 0.04;

  vec2  alRaton  = posicion - u_mouse;
  float dist2    = dot(alRaton, alRaton);
  float cercania = 1000.0 / (dist2 + 1000.0);
  vec2  fuerzaRaton = u_mouse_velocity * cercania * 0.08;

  velocidad = velocidad * 0.98 + fuerzaRuido + fuerzaRaton;
  posicion  = posicion + velocidad;

  v_posvel   = vec4(posicion, velocidad);
  v_lifeseed = vec4(vida, vidaMax, semilla);
  v_color    = a_color;
  v_home     = a_home;

  bool muerta = vida >= vidaMax
             || posicion.x < 0.0 || posicion.x > u_resolution.x
             || posicion.y < 0.0 || posicion.y > u_resolution.y;

  if (muerta) {
    /* Vuelve a su sitio en la frase, con un pelín de dispersión para que dos
       partículas de la misma casa no se solapen exactamente. */
    vec3 h = hash33(vec3(semilla, u_time + vida));
    v_posvel   = vec4(a_home + h.xy * u_size, 0.0, 0.0);
    v_lifeseed = vec4(0.0, vidaMax, h.xy);
  }

  float razonVida = v_lifeseed.x / vidaMax;
  float alfa = smoothstep(0.0, 0.05, razonVida) * (1.0 - smoothstep(0.7, 1.0, razonVida));
  gl_PointSize = smoothstep(1.0, 0.4, razonVida) * u_size * 1.6 * alfa;
  v_alpha = alfa * 0.55;

  vec2 ndc = v_posvel.xy / u_resolution * 2.0 - 1.0;
  ndc.y    = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
}`

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec3 v_color;
in float v_alpha;

out vec4 fragColor;

void main() {
  float dist  = length(gl_PointCoord - 0.5);
  float forma = 1.0 - smoothstep(0.25, 0.5, dist);
  fragColor = vec4(v_color, v_alpha * forma);
}`

type Opciones = {
  /** Sección donde se inserta el lienzo. */
  container: HTMLElement
  /** El elemento con la frase escrita: de él se calcan las letras. */
  origen: HTMLElement
  /** Colores de las partículas, en `#rrggbb`. */
  colores: [string, string]
  /** Cuántas partículas. Se recorta si la frase ocupa pocos píxeles. */
  numParticles?: number
  /** Se llama cuando la escena está montada y ya hay algo que dibujar. */
  onListo?: () => void
}

/** `#rrggbb` a los tres canales en 0..1 que espera el shader. */
function aRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export class ParticleText {
  #jugando = false
  #ultimo = 0
  #visible = true

  private renderer: Renderer
  private gl: Renderer['gl']
  private malla: Mesh | null = null
  private container: HTMLElement
  private origen: HTMLElement
  private colores: [string, string]
  private numParticles: number
  private onListo?: () => void

  private u_time = new Uniform({ name: 'u_time', value: 0, kind: 'float' })
  private u_resolution = new Uniform({ name: 'u_resolution', value: [1, 1], kind: 'float_vec2' })
  private u_mouse = new Uniform({ name: 'u_mouse', value: [-10000, -10000], kind: 'float_vec2' })
  private u_mouse_velocity = new Uniform({ name: 'u_mouse_velocity', value: [0, 0], kind: 'float_vec2' })
  private u_size = new Uniform({ name: 'u_size', value: 1.5, kind: 'float' })

  private ratonDestino: [number, number] = [-10000, -10000]
  private ratonUltimo: [number, number] = [-10000, -10000]
  private ratonVelocidad: [number, number] = [0, 0]

  private observador: IntersectionObserver | null = null
  private observadorTamano: ResizeObserver | null = null
  private reconstruir = 0

  constructor({ container, origen, colores, numParticles = 180000, onListo }: Opciones) {
    this.container = container
    this.origen = origen
    this.colores = colores
    this.numParticles = numParticles
    this.onListo = onListo

    this.renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), alpha: true })
    this.gl = this.renderer.gl

    /* Sin WebGL2 no hay transform feedback y todo esto no funciona. Se avisa
       arriba para que la frase se quede escrita en vez de desaparecer. */
    if (!this.renderer.isWebgl2) {
      ;(this.gl.canvas as HTMLCanvasElement).remove()
      throw new Error('ParticleText necesita WebGL2')
    }

    this.gl.depthMask(false)
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.clearColor(0, 0, 0, 0)

    const canvas = this.gl.canvas as HTMLCanvasElement
    canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;inset:0;'
    container.appendChild(canvas)

    this.render = this.render.bind(this)
    this.punteroMueve = this.punteroMueve.bind(this)
    this.punteroSale = this.punteroSale.bind(this)

    window.addEventListener('pointermove', this.punteroMueve, { passive: true })
    canvas.addEventListener('pointerleave', this.punteroSale)

    /* Fuera de pantalla no se dibuja: la sección vive a media página y no tiene
       sentido gastar GPU mientras nadie la ve. */
    this.observador = new IntersectionObserver(
      ([e]) => {
        this.#visible = e.isIntersecting
      },
      { rootMargin: '10%' },
    )
    this.observador.observe(container)

    this.observadorTamano = new ResizeObserver(() => {
      window.clearTimeout(this.reconstruir)
      this.reconstruir = window.setTimeout(() => this.medirYMontar(), 200)
    })
    this.observadorTamano.observe(container)

    this.medirYMontar()
  }

  /**
   * Calca la frase escrita del DOM a un lienzo.
   *
   * No se vuelve a maquetar el texto: se recorren sus palabras, se pregunta al
   * navegador dónde ha puesto cada una y con qué tipografía, y se dibuja ahí.
   * Así las partículas caen justo encima de las letras que se ven. Rehacer la
   * maquetación aparte daba otro reparto de líneas y se veían dos frases
   * distintas superpuestas.
   */
  private rasterizar(w: number, h: number, dpr: number): Uint8ClampedArray {
    const lienzo = document.createElement('canvas')
    lienzo.width = w
    lienzo.height = h
    const ctx = lienzo.getContext('2d')!
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#fff'

    const caja = this.container.getBoundingClientRect()
    const paseo = document.createTreeWalker(this.origen, NodeFilter.SHOW_TEXT)
    const rango = document.createRange()

    for (let nodo = paseo.nextNode(); nodo; nodo = paseo.nextNode()) {
      const texto = nodo.textContent ?? ''
      if (!texto.trim()) continue

      const padre = nodo.parentElement
      if (!padre) continue
      const cs = getComputedStyle(padre)
      ctx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * dpr}px ${cs.fontFamily}`

      /* Palabra a palabra: un rango sobre todo el nodo daría una sola caja por
         línea y no se sabría dónde empieza cada palabra dentro de ella. */
      const re = /\S+/g
      let m: RegExpExecArray | null
      while ((m = re.exec(texto)) !== null) {
        rango.setStart(nodo, m.index)
        rango.setEnd(nodo, m.index + m[0].length)
        for (const r of rango.getClientRects()) {
          if (r.width < 0.5) continue
          ctx.fillText(
            m[0],
            (r.left - caja.left) * dpr,
            (r.top + r.height / 2 - caja.top) * dpr,
          )
        }
      }
    }

    return ctx.getImageData(0, 0, w, h).data
  }

  private medirYMontar() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (w < 2 || h < 2) return

    this.renderer.dimensions = new Vec2(w, h)
    const dpr = this.renderer.dpr
    const pw = Math.round(w * dpr)
    const ph = Math.round(h * dpr)
    this.u_resolution.value = [pw, ph]
    this.u_size.value = Math.max(1.2, dpr * 1.1)

    const datos = this.rasterizar(pw, ph, dpr)

    /* Lista de píxeles pintados de las letras. Se recorren todos: con paso 2 el
       reparto salía pobre porque limitaba el techo de partículas. */
    const casas: number[] = []
    const paso = 1
    for (let y = 0; y < ph; y += paso) {
      for (let x = 0; x < pw; x += paso) {
        if (datos[(y * pw + x) * 4 + 3] > 128) casas.push(x, y)
      }
    }

    const totalCasas = casas.length / 2
    if (totalCasas === 0) return

    // Sin sentido tener muchas más partículas que sitios donde nacer.
    const N = Math.min(this.numParticles, totalCasas * 4)
    this.montarEscena(casas, totalCasas, N)
    this.jugando = true
    this.onListo?.()
  }

  /** Cierto cuando hay escena montada, es decir cuando hay algo que dibujar. */
  get listo() {
    return this.malla !== null
  }

  private montarEscena(casas: number[], totalCasas: number, N: number) {
    const gl = this.gl

    const posvel = new Float32Array(N * 4)
    const lifeseed = new Float32Array(N * 4)
    const color = new Float32Array(N * 3)
    const home = new Float32Array(N * 2)

    const [c1, c2] = [aRgb(this.colores[0]), aRgb(this.colores[1])]

    for (let i = 0; i < N; i++) {
      const c = Math.floor(Math.random() * totalCasas) * 2
      const hx = casas[c]
      const hy = casas[c + 1]
      const vidaMax = 90 + Math.random() * 260

      home[i * 2] = hx
      home[i * 2 + 1] = hy

      posvel[i * 4] = hx
      posvel[i * 4 + 1] = hy
      posvel[i * 4 + 2] = (Math.random() - 0.5) * 0.5
      posvel[i * 4 + 3] = (Math.random() - 0.5) * 0.5

      // Vidas repartidas al azar: si no, todas nacen y mueren a la vez.
      lifeseed[i * 4] = Math.random() * vidaMax
      lifeseed[i * 4 + 1] = vidaMax
      lifeseed[i * 4 + 2] = Math.random() * 2 - 1
      lifeseed[i * 4 + 3] = Math.random() * 2 - 1

      const t = Math.random()
      color[i * 3] = c1[0] + (c2[0] - c1[0]) * t
      color[i * 3 + 1] = c1[1] + (c2[1] - c1[1]) * t
      color[i * 3 + 2] = c1[2] + (c2[2] - c1[2]) * t
    }

    const programa = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        u_time: this.u_time,
        u_resolution: this.u_resolution,
        u_mouse: this.u_mouse,
        u_mouse_velocity: this.u_mouse_velocity,
        u_size: this.u_size,
      },
      transparent: true,
      depthTest: false,
      transformFeedbackVaryings: ['v_posvel', 'v_lifeseed', 'v_color', 'v_home'],
    })

    /* El orden de las claves importa: la librería asigna las posiciones de
       atributo por índice, y tienen que coincidir con los `layout(location=N)`
       del shader — a_posvel 0, a_lifeseed 1, a_color 2, a_home 3.

       El `program` va sin envolver: internamente se pasa a bindAttribLocation,
       que espera el WebGLProgram crudo. La firma de tipos de wtc-gl pide el
       objeto Program y está equivocada. */
    const feedback = new TransformFeedback(gl, {
      program: programa.program as unknown as Program,
      transformFeedbacks: {
        a_posvel: { data: posvel, size: 4, usage: gl.STREAM_COPY, varying: 'v_posvel' },
        a_lifeseed: { data: lifeseed, size: 4, usage: gl.STREAM_COPY, varying: 'v_lifeseed' },
        a_color: { data: color, size: 3, usage: gl.STREAM_COPY, varying: 'v_color' },
        a_home: { data: home, size: 2, usage: gl.STREAM_COPY, varying: 'v_home' },
      },
    })

    const nube = new PointCloud(gl, {
      particles: N,
      dimensions: 2,
      fillFunction: (pts: Float32Array) => {
        for (let i = 0; i < N; i++) {
          pts[i * 2] = posvel[i * 4]
          pts[i * 2 + 1] = posvel[i * 4 + 1]
        }
      },
      attributes: {
        a_posvel: new GeometryAttribute({ size: 4, data: posvel }),
        a_lifeseed: new GeometryAttribute({ size: 4, data: lifeseed }),
        a_color: new GeometryAttribute({ size: 3, data: color }),
        a_home: new GeometryAttribute({ size: 2, data: home }),
      },
      transformFeedbacks: feedback,
    })

    this.malla = new Mesh(gl, { mode: gl.POINTS, geometry: nube, program: programa })
  }

  private punteroMueve(e: PointerEvent) {
    const rect = (this.gl.canvas as HTMLCanvasElement).getBoundingClientRect()
    const dpr = this.renderer.dpr

    // Si venía de fuera, iguala el anterior al actual: si no, el primer
    // movimiento genera una velocidad enorme y dispara las partículas.
    if (this.ratonDestino[0] < -9000) {
      this.ratonUltimo[0] = (e.clientX - rect.left) * dpr
      this.ratonUltimo[1] = (e.clientY - rect.top) * dpr
    }

    this.ratonDestino[0] = (e.clientX - rect.left) * dpr
    this.ratonDestino[1] = (e.clientY - rect.top) * dpr
    this.u_mouse.value = this.ratonDestino
  }

  private punteroSale() {
    const dpr = this.renderer.dpr
    this.ratonDestino[0] = -10000 * dpr
    this.ratonDestino[1] = -10000 * dpr
    this.ratonUltimo[0] = this.ratonDestino[0]
    this.ratonUltimo[1] = this.ratonDestino[1]
    this.u_mouse.value = this.ratonDestino
    this.ratonVelocidad[0] = 0
    this.ratonVelocidad[1] = 0
  }

  private render(t: number) {
    const primera = this.#ultimo === 0
    const diff = t - this.#ultimo
    this.#ultimo = t

    if (this.#jugando) requestAnimationFrame(this.render)
    if (primera || !this.malla) return

    if (!this.#visible) return

    this.u_time.value = (this.u_time.value as number) + diff * 0.00005

    const vx = this.ratonDestino[0] - this.ratonUltimo[0]
    const vy = this.ratonDestino[1] - this.ratonUltimo[1]
    this.ratonVelocidad[0] += (vx - this.ratonVelocidad[0]) * 0.15
    this.ratonVelocidad[1] += (vy - this.ratonVelocidad[1]) * 0.15
    this.ratonUltimo[0] = this.ratonDestino[0]
    this.ratonUltimo[1] = this.ratonDestino[1]
    this.u_mouse_velocity.value = this.ratonVelocidad

    this.renderer.render({ scene: this.malla, update: true, sort: false, frustumCull: false })
  }

  set jugando(v: boolean) {
    if (!this.#jugando && v) {
      this.#jugando = true
      this.#ultimo = 0
      requestAnimationFrame(this.render)
    } else if (!v) {
      this.#jugando = false
    }
  }
  get jugando() {
    return this.#jugando
  }

  destroy() {
    this.#jugando = false
    window.clearTimeout(this.reconstruir)
    window.removeEventListener('pointermove', this.punteroMueve)
    const canvas = this.gl.canvas as HTMLCanvasElement
    canvas.removeEventListener('pointerleave', this.punteroSale)
    this.observador?.disconnect()
    this.observadorTamano?.disconnect()
    canvas.remove()
  }
}
