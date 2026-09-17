import { useEffect, useRef } from 'react'
import './FooterGlass.css'

/**
 * Cristal facetado del pie, portado del prototipo `Footer glass` de Lab-FX.
 *
 * Una retícula hexagonal refracta un degradado de papel: cada celda desvía la
 * superficie hacia su centro, separa un poco los canales de color —aberración
 * cromática— y recibe un brillo especular. La retícula respira con una onda
 * lenta.
 *
 * El degradado se compone dentro del shader en lugar de cargar una imagen: no
 * hay archivo que pedir, no aparece banding al ampliarlo y la refracción tiene
 * una superficie limpia sobre la que trabajar.
 *
 * Del prototipo se quedan fuera los mandos (celda, amplitud, cromática, forma,
 * onda al hacer clic), el vídeo y el modo alambre: aquí los valores están
 * calibrados y fijos. Se añade lo que un prototipo no necesita: pausa cuando el
 * pie no se ve, respeto por `prefers-reduced-motion` y renuncia silenciosa si
 * no hay WebGL.
 */

const VERTICE = `
attribute vec2 aPos;
varying vec2 vUV;
void main(){ vUV = 0.5 * (aPos + 1.0); gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAGMENTO = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uPapel, uCrema, uFrio;
uniform float uCell, uAmp, uChrom, uAnimate;

varying vec2 vUV;

/* Retícula hexagonal: de píxel a coordenada axial, se redondea a la celda más
   cercana y se vuelve a píxel. Es lo que da el mosaico de panal. */
vec2 hexAAxial(vec2 p, float s){
  float q = (1.7320508 / 3.0 * p.x - 0.3333333 * p.y) / s;
  float r = (0.6666667 * p.y) / s;
  return vec2(q, r);
}

vec3 redondeoCubico(vec3 c){
  float rx = floor(c.x + 0.5), ry = floor(c.y + 0.5), rz = floor(c.z + 0.5);
  float dx = abs(rx - c.x), dy = abs(ry - c.y), dz = abs(rz - c.z);
  if (dx > dy && dx > dz) rx = -ry - rz;
  else if (dy > dz) ry = -rx - rz;
  else rz = -rx - ry;
  return vec3(rx, ry, rz);
}

vec2 axialRedondeada(vec2 qr){
  vec3 cubo = vec3(qr.x, -qr.x - qr.y, qr.y);
  vec3 rc = redondeoCubico(cubo);
  return vec2(rc.x, rc.z);
}

vec2 axialAPixel(vec2 qr, float s){
  return vec2(s * (1.7320508 * qr.x + 0.8660254 * qr.y), s * (1.5 * qr.y));
}

float sdHexagono(vec2 p, float r){
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.7320508))) - r, p.x - r);
}

/* Ruido de valor: dos octavas bastan para el grano de un cristal. */
float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float ruido(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

/* El fondo ya no es una fotografía sino un degradado: papel cálido que vira a
   crema por el costado y se enfría por la esquina inferior. Se compone aquí, en
   el shader, y no en una imagen: así no hay banding al ampliarlo ni un archivo
   más que cargar, y la refracción tiene una superficie limpia sobre la que
   trabajar. */
vec3 muestra(vec2 uv){
  float diagonal = clamp((uv.x * 0.72 + (1.0 - uv.y) * 0.28), 0.0, 1.0);
  vec3 col = mix(uPapel, uCrema, smoothstep(0.1, 0.95, diagonal));

  float frio = smoothstep(0.42, 1.0, uv.x) * smoothstep(0.55, 0.0, uv.y);
  col = mix(col, uFrio, frio * 0.85);

  float grano = (ruido(uv * 520.0) - 0.5) * 0.016 + (ruido(uv * 130.0) - 0.5) * 0.012;
  return col + grano;
}

void main(){
  vec2 res = iResolution;
  vec2 p = gl_FragCoord.xy - 0.5 * res;
  vec2 uv = vUV;

  float celda = max(6.0, uCell);
  float onda = (uAnimate > 0.5) ? sin(p.x * 0.01 + p.y * 0.015 + iTime) * 0.25 : 0.0;
  float celdaLocal = celda * (1.0 + onda * 0.2);

  vec2 centro = axialAPixel(axialRedondeada(hexAAxial(p, celdaLocal)), celdaLocal);
  vec2 local = p - centro;
  float d = sdHexagono(local, celdaLocal * 0.95);
  float dentro = smoothstep(0.0, 1.5, -d);

  float radio = clamp(length(local) / (celdaLocal * 0.95), 0.0, 1.0);
  vec2 n = normalize(local + 1e-6);

  vec3 base = muestra(uv);
  vec2 refraccion = n * (uAmp * (1.0 - pow(radio, 1.4)) * 0.07);
  vec2 ca = refraccion * (0.25 * uChrom);

  vec3 cristal;
  cristal.r = muestra(uv + refraccion + ca).r;
  cristal.g = muestra(uv + refraccion).g;
  cristal.b = muestra(uv + refraccion - ca * (0.6 * uChrom)).b;

  /* Luz fija arriba a la derecha: sin ratón que la mueva, una dirección
     constante mantiene el relieve coherente en toda la retícula. El brillo va
     mucho más bajo que en el prototipo —0,12 frente a 0,45—: allí competía con
     una fotografía y aquí, sobre un degradado casi liso, a esa fuerza dibujaba
     manchas blancas en vez de facetas. */
  vec2 luz = normalize(vec2(0.7, 1.0));
  float brillo = pow(max(0.0, dot(luz, n)), 10.0) * (1.0 - radio);

  /* Filo de la faceta: sobre una superficie lisa, la refracción apenas desvía
     nada y sin esta línea la retícula no se vería. Es lo que dibuja el mosaico. */
  float filo = smoothstep(2.2, 0.0, abs(d)) * 0.5;

  vec3 col = mix(base, cristal, dentro);
  col += vec3(1.0, 0.985, 0.96) * brillo * 0.12;
  col += vec3(1.0) * filo * 0.035;
  col -= vec3(0.02, 0.018, 0.012) * smoothstep(0.35, 1.0, radio) * dentro;

  gl_FragColor = vec4(col, 1.0);
}
`

const CELDA = 44
const AMPLITUD = 0.62
const CROMATICA = 0.7
const VELOCIDAD = 0.35

function compilar(gl: WebGLRenderingContext, tipo: number, fuente: string) {
  const shader = gl.createShader(tipo)
  if (!shader) return null
  gl.shaderSource(shader, fuente)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function FooterGlass() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return

    const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE)
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO)
    if (!vs || !fs) return

    const programa = gl.createProgram()
    if (!programa) return
    gl.attachShader(programa, vs)
    gl.attachShader(programa, fs)
    gl.linkProgram(programa)
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return
    gl.useProgram(programa)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(programa, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = {
      resolucion: gl.getUniformLocation(programa, 'iResolution'),
      tiempo: gl.getUniformLocation(programa, 'iTime'),
      papel: gl.getUniformLocation(programa, 'uPapel'),
      crema: gl.getUniformLocation(programa, 'uCrema'),
      frio: gl.getUniformLocation(programa, 'uFrio'),
      celda: gl.getUniformLocation(programa, 'uCell'),
      amplitud: gl.getUniformLocation(programa, 'uAmp'),
      cromatica: gl.getUniformLocation(programa, 'uChrom'),
      anima: gl.getUniformLocation(programa, 'uAnimate'),
    }

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Colores del degradado, tomados de la muestra de la clienta: papel cálido
       del sistema, crema por el costado y un gris azulado que enfría la esquina
       inferior. Van como uniformes y no incrustados en el shader para que se
       vean de un vistazo y se puedan ajustar sin tocar GLSL. */
    const PAPEL: [number, number, number] = [0.953, 0.945, 0.929]
    const CREMA: [number, number, number] = [0.945, 0.925, 0.855]
    const FRIO: [number, number, number] = [0.878, 0.898, 0.917]

    const medir = () => {
      /* Tope de 1,5 en densidad: a 2x en una pantalla retina el coste se dobla
         y a este tamaño de celda no se nota la diferencia. */
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      const ancho = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const alto = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== ancho || canvas.height !== alto) {
        canvas.width = ancho
        canvas.height = alto
        gl.viewport(0, 0, ancho, alto)
      }
    }

    const pintar = (t: number) => {
      medir()
      gl.uniform2f(u.resolucion, canvas.width, canvas.height)
      gl.uniform1f(u.tiempo, t)
      gl.uniform1f(u.celda, CELDA * Math.min(1.5, window.devicePixelRatio || 1))
      gl.uniform1f(u.amplitud, AMPLITUD)
      gl.uniform1f(u.cromatica, CROMATICA)
      gl.uniform1f(u.anima, sinMovimiento ? 0 : 1)
      gl.uniform3fv(u.papel, PAPEL)
      gl.uniform3fv(u.crema, CREMA)
      gl.uniform3fv(u.frio, FRIO)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    let visible = false
    let animacion = 0
    const inicio = performance.now()

    const bucle = () => {
      pintar(((performance.now() - inicio) / 1000) * VELOCIDAD)
      animacion = requestAnimationFrame(bucle)
    }

    /* El pie está al final de la página: sin esto, la retícula seguiría
       calculándose mientras se lee la portada. */
    /* Un primer fotograma nada más montar: el lienzo nace con el tamaño por
       defecto de 300x150 y, si el bucle no llega a arrancar —pie fuera de
       pantalla, movimiento reducido—, se quedaría estirado a lo ancho del pie. */
    pintar(0)

    const observador = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible && !sinMovimiento) {
        if (!animacion) animacion = requestAnimationFrame(bucle)
      } else {
        cancelAnimationFrame(animacion)
        animacion = 0
        if (visible) pintar(0)
      }
    })
    observador.observe(canvas)

    /* El pie cambia de alto por su cuenta —tipografías que cargan, menú que se
       abre—, no sólo al redimensionar la ventana. */
    const observadorTamano = new ResizeObserver(() => {
      if (!animacion) pintar(0)
    })
    observadorTamano.observe(canvas)

    return () => {
      observador.disconnect()
      observadorTamano.disconnect()
      cancelAnimationFrame(animacion)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(programa)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return <canvas ref={canvasRef} className="footer-glass" aria-hidden="true" />
}
