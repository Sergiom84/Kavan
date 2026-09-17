import { useEffect, useRef } from 'react'
import './FooterGlass.css'

/**
 * Cristal facetado del pie, portado del prototipo `Footer glass` de Lab-FX.
 *
 * Una retícula hexagonal refracta la fotografía del campamento: cada celda
 * desvía la imagen hacia su centro, separa un poco los canales de color
 * —aberración cromática— y recibe un brillo especular. La retícula respira con
 * una onda lenta.
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
uniform sampler2D iChannel0;
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

vec3 muestra(vec2 uv){ return texture2D(iChannel0, uv).rgb; }

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
     constante mantiene el relieve coherente en toda la retícula. */
  vec2 luz = normalize(vec2(0.7, 1.0));
  float brillo = pow(max(0.0, dot(luz, n)), 14.0) * (1.0 - radio);

  vec3 col = mix(base, cristal + vec3(1.0, 0.96, 0.9) * brillo * 0.45, dentro);
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
      textura: gl.getUniformLocation(programa, 'iChannel0'),
      celda: gl.getUniformLocation(programa, 'uCell'),
      amplitud: gl.getUniformLocation(programa, 'uAmp'),
      cromatica: gl.getUniformLocation(programa, 'uChrom'),
      anima: gl.getUniformLocation(programa, 'uAnimate'),
    }

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Textura de un solo nivel y `CLAMP_TO_EDGE`: la refracción muestrea fuera
       del borde y con repetición saltaría al otro extremo de la fotografía. */
    const textura = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, textura)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([214, 190, 152]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(u.textura, 0)

    let listaLaFoto = false
    const foto = new Image()
    foto.decoding = 'async'
    foto.src = '/images/footer-glass.webp'
    foto.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, textura)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, foto)
      listaLaFoto = true
      if (sinMovimiento || !visible) pintar(0)
    }

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
    const observador = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible && !sinMovimiento) {
        if (!animacion) animacion = requestAnimationFrame(bucle)
      } else {
        cancelAnimationFrame(animacion)
        animacion = 0
        if (visible && listaLaFoto) pintar(0)
      }
    })
    observador.observe(canvas)

    const alRedimensionar = () => {
      if (!animacion && listaLaFoto) pintar(0)
    }
    window.addEventListener('resize', alRedimensionar)

    return () => {
      observador.disconnect()
      cancelAnimationFrame(animacion)
      window.removeEventListener('resize', alRedimensionar)
      foto.onload = null
      gl.deleteTexture(textura)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(programa)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return <canvas ref={canvasRef} className="footer-glass" aria-hidden="true" />
}
