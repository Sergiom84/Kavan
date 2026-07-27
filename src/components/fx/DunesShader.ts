/**
 * Campo de dunas raymarcheado en WebGL2, para la pantalla de carga.
 *
 * PROCEDENCIA — leer antes de tocar esto:
 * El shader de fragmentos viene del pen "CPChallange: Desert Dunes (Sand)" de
 * tommyho (https://codepen.io/tommyho/pen/ZYBdaxP), que a su vez lo marca como
 * importado de Shadertoy sin indicar autor ni licencia. Se integra por decisión
 * expresa de Sergio. La licencia por defecto de Shadertoy es CC BY-NC-SA 3.0
 * (no comercial), así que la cuestión sigue abierta: si hay que retirarlo, basta
 * con sustituir FRAGMENTO y el resto de este fichero sigue sirviendo.
 *
 * Lo que no se copia del pen: cargaba gl-matrix desde un CDN sin usarla en
 * ninguna línea, dibujaba a resolución completa y no soltaba nunca el bucle.
 * Aquí se dibuja a resolución reducida —el raymarcher cuesta 96 pasos de traza
 * por píxel, y la escena es tan blanda que el reescalado no se ve— y hay un
 * `destroy` que corta el bucle y libera el contexto.
 */

const VERTICE = `#version 300 es
in vec4 aPosition;
void main() {
    gl_Position = aPosition;
}`

const FRAGMENTO = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
out vec4 fragColor;

#define FAR 80.
#define RIGID

mat2 rot2(in float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

float hash(vec3 p){ return fract(sin(dot(p, vec3(21.71, 157.97, 113.43)))*45758.5453); }

float smin(float a, float b, float s){
    float h = clamp(0.5 + 0.5*(b-a)/s, 0., 1.);
    return mix(b, a, h) - h*(1.0-h)*s;
}

float smax(float a, float b, float s){
    float h = clamp(0.5 + 0.5*(a-b)/s, 0., 1.);
    return mix(b, a, h) + h*(1.0-h)*s;
}

vec2 hash22(vec2 p) {
    float n = sin(dot(p, vec2(113., 1.)));
    p = fract(vec2(2097152., 262144.)*n)*2. - 1.;
    return p;
}

float gradN2D(in vec2 f){
    const vec2 e = vec2(0, 1);
    vec2 p = floor(f);
    f -= p;
    vec2 w = f*f*(3. - 2.*f);
    float c = mix(
        mix(dot(hash22(p+e.xx), f-e.xx), dot(hash22(p+e.yx), f-e.yx), w.x),
        mix(dot(hash22(p+e.xy), f-e.xy), dot(hash22(p+e.yy), f-e.yy), w.x),
        w.y
    );
    return c*.5 + .5;
}

float fBm(in vec2 p){
    return gradN2D(p)*.57 + gradN2D(p*2.)*.28 + gradN2D(p*4.)*.15;
}

float n2D(vec2 p) {
    vec2 i = floor(p); p -= i;
    p *= p*(3. - p*2.);
    return dot(mat2(fract(sin(mod(vec4(0,1,113,114) + dot(i,vec2(1,113)), 6.2831853))*43758.5453))
        * vec2(1.-p.y, p.y), vec2(1.-p.x, p.x));
}

float grad(float x, float offs){
    x = abs(fract(x/6.283 + offs - .25) - .5)*2.;
    float x2 = clamp(x*x*(-1. + 2.*x), 0., 1.);
    x = smoothstep(0., 1., x);
    return mix(x, x2, .15);
}

float sandL(vec2 p){
    vec2 q = rot2(3.14159/18.)*p;
    q.y += (gradN2D(q*18.) - .5)*.05;
    float grad1 = grad(q.y*80., 0.);
    q = rot2(-3.14159/20.)*p;
    q.y += (gradN2D(q*12.) - .5)*.05;
    float grad2 = grad(q.y*80., .5);
    q = rot2(3.14159/4.)*p;
    float a2 = dot(sin(q*12. - cos(q.yx*12.)), vec2(.25)) + .5;
    float a1 = 1. - a2;
    return 1. - (1.-grad1*a1)*(1.-grad2*a2);
}

float sand(vec2 p, float gT){
    p = vec2(p.y-p.x, p.x+p.y)*.7071/4.;
    float c1 = sandL(p);
    vec2 q = rot2(3.14159/12.)*p;
    float c2 = sandL(q*1.25);
    c1 = mix(c1, c2, smoothstep(.1, .9, gradN2D(p*vec2(4))));
    return c1/(1. + gT*gT*.015);
}

vec2 path(in float z){
    return vec2(4.*sin(z*.1), 0);
}

float surfFunc(in vec3 p){
    p /= 2.5;
    float layer1 = n2D(p.xz*.2)*2. - .5;
    layer1 = smoothstep(0., 1.05, layer1);
    float layer2 = n2D(p.xz*.275);
    layer2 = 1. - abs(layer2-.5)*2.;
    layer2 = smoothstep(.2, 1., layer2*layer2);
    float layer3 = n2D(p.xz*.5*3.);
    return layer1*.7 + layer2*.25 + layer3*.05;
}

float camSurfFunc(in vec3 p){
    p /= 2.5;
    float layer1 = n2D(p.xz*.2)*2. - .5;
    layer1 = smoothstep(0., 1.05, layer1);
    float layer2 = n2D(p.xz*.275);
    layer2 = 1. - abs(layer2-.5)*2.;
    layer2 = smoothstep(.2, 1., layer2*layer2);
    return (layer1*.7 + layer2*.25)/.95;
}

float map(vec3 p){
    float sf = surfFunc(p);
    return p.y + (.5-sf)*2.;
}

float trace(in vec3 ro, in vec3 rd){
    float t=0., h;
    for(int i=0; i<96; i++){
        h = map(ro+rd*t);
        if(abs(h)<.001*(t*.125+1.) || t>FAR) break;
        t += h;
    }
    return min(t, FAR);
}

vec3 getNormal(in vec3 p, float ef){
    float sgn = 1.;
    vec3 e = vec3(.001*ef, 0, 0), mp = e.zzz;
    for(int i=0; i<6; i++){
        mp.x += map(p + sgn*e)*sgn;
        sgn = -sgn;
        if((i&1)==1){ mp = mp.yzx; e = e.zxy; }
    }
    return normalize(mp);
}

float softShadow(vec3 ro, vec3 lp, float k, float t){
    vec3 rd = lp - ro;
    float shade = 1.;
    float dist = 0.0015;
    float end = max(length(rd), .0001);
    rd /= end;
    for(int i=0; i<24; i++){
        float h = map(ro+rd*dist);
        shade = min(shade, k*h/dist);
        h = clamp(h, .1, .5);
        dist += h;
        if(shade<.001 || dist>end) break;
    }
    return min(max(shade, 0.) + .05, 1.);
}

float calcAO(in vec3 p, in vec3 n){
    float ao = 0.0;
    const float maxDist = 4.;
    const float nbIte = 5.;
    for(int i=1; i<=5; i++){
        float l = float(i)*.5/nbIte*maxDist;
        ao += (l - map(p+n*l));
    }
    return clamp(1. - ao/nbIte, 0., 1.);
}

vec3 getSky(vec3 ro, vec3 rd, vec3 ld){
    vec3 col = vec3(.8,.7,.5), col2 = vec3(.4,.6,.9);
    vec3 sky = mix(col, col2, pow(max(rd.y+.15, 0.), .5));
    sky *= vec3(.84, 1, 1.17);
    float sun = clamp(dot(ld, rd), 0., 1.);
    sky += vec3(1,.7,.4)*pow(sun, 16.)*.2;
    sun = pow(sun, 32.);
    sky += vec3(1,.9,.6)*pow(sun, 32.)*.35;
    rd.z *= 1. + length(rd.xy)*.15;
    rd = normalize(rd);
    const float SC = 1e5;
    float t = (SC - ro.y - .15)/(rd.y + .15);
    vec2 uv = (ro + t*rd).xz;
    if(t > 0.)
        sky = mix(sky, vec3(2),
            smoothstep(.45, 1., fBm(1.5*uv/SC)) *
            smoothstep(.45, .55, rd.y*.5+.5)*.4);
    return sky;
}

float noise3D(in vec3 p){
    const vec3 s = vec3(113, 157, 1);
    vec3 ip = floor(p);
    vec4 h = vec4(0., s.yz, s.y+s.z) + dot(ip, s);
    p -= ip;
    p = p*p*(3.-2.*p);
    h = mix(fract(sin(h)*43758.5453), fract(sin(h+s.x)*43758.5453), p.x);
    vec2 h2 = mix(h.xz, h.yw, p.y);
    return mix(h2.x, h2.y, p.z);
}

float getMist(in vec3 ro, in vec3 rd, in vec3 lp, in float t){
    float mist=0., t0=0.;
    for(int i=0; i<24; i++){
        if(t0>t) break;
        float sDi = length(lp-ro)/FAR;
        float sAtt = 1./(1.+sDi*.25);
        vec3 ro2 = (ro+rd*t0)*2.5;
        float c = noise3D(ro2)*.65 + noise3D(ro2*3.)*.25 + noise3D(ro2*9.)*.1;
        mist += c*sAtt;
        t0 += clamp(c*.25, .1, 1.);
    }
    return max(mist/48., 0.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 u = (fragCoord - iResolution.xy*.5)/iResolution.y;

    vec3 ro = vec3(0, 1.2, iTime*2.);
    vec3 lookAt = ro + vec3(0, -.15, .5);

    ro.xy += path(ro.z);
    lookAt.xy += path(lookAt.z);

    float sfH = camSurfFunc(ro);
    float sfH2 = camSurfFunc(lookAt);
    float slope = (sfH2-sfH)/length(lookAt-ro);

    ro.y += sfH2;
    lookAt.y += sfH2;

    float FOV = 3.14159265/2.5;
    vec3 forward = normalize(lookAt-ro);
    vec3 right = normalize(vec3(forward.z, 0, -forward.x));
    vec3 up = cross(forward, right);
    vec3 rd = normalize(forward + FOV*u.x*right + FOV*u.y*up);

    rd.xy = rot2(path(lookAt.z).x/96.)*rd.xy;
    rd.yz = rot2(-slope/3.)*rd.yz;

    vec3 lp = vec3(FAR*.25, FAR*.25, FAR) + vec3(0,0,ro.z);

    float t = trace(ro, rd);
    float gT = t;

    vec3 col = vec3(0);
    vec3 sp = ro + rd*t;
    float pathHeight = sp.y;

    if(t < FAR){
        vec3 sn = getNormal(sp, 1.);
        vec3 ld = lp - sp;
        float lDist = max(length(ld), 0.001);
        ld /= lDist;
        lDist /= FAR;
        float atten = 1./(1.+lDist*lDist*.025);

        float sh = softShadow(sp+sn*.002, lp, 6., t);
        float ao = calcAO(sp, sn);
        sh = min(sh+ao*.25, 1.);

        float dif = max(dot(ld, sn), 0.);
        float spe = pow(max(dot(reflect(-ld,sn), -rd), 0.), 5.);
        float fre = clamp(1.+dot(rd,sn), 0., 1.);
        float Schlick = pow(1.-max(dot(rd, normalize(rd+ld)), 0.), 5.);
        float fre2 = mix(.2, 1., Schlick);
        float amb = ao*.35;

        vec3 base = mix(vec3(1,.95,.7), vec3(.9,.6,.4), fBm(sp.xz*16.));
        base = mix(base*1.4, base*.6, fBm(sp.xz*32.-.5));

        float bSurf = sand(sp.xz, gT);
        base *= bSurf*.75 + .5;

        base = mix(base*.7 + (hash(floor(sp*96.))*.7+hash(floor(sp*192.))*.3)*.3,
                   base, min(t*t/FAR, 1.));
        base *= vec3(1.2, 1, .9);

        col = base*(dif+amb+vec3(1,.97,.92)*fre2*spe*2.)*atten;

        vec3 gLD = normalize(lp-vec3(0,0,ro.z));
        vec3 refSky = getSky(sp, reflect(rd,sn), gLD);
        col += col*refSky*.05 + refSky*fre*fre2*atten*.15;

        col *= sh*ao;
    }

    float dust = getMist(ro,rd,lp,t)*(1.-smoothstep(0.,1.,pathHeight*.05));

    vec3 gLD = normalize(lp-vec3(0,0,ro.z));
    vec3 sky = getSky(ro, rd, gLD);

    col = mix(col, sky, smoothstep(0.,.95,t/FAR));

    vec3 mistCol = vec3(1,.95,.9);
    col = col*.75 + (col+.25*vec3(1.2,1,.9))*mistCol*dust*1.5;
    col += vec3(1,.6,.2)*pow(max(dot(rd,gLD),0.),16.)*.45;

    vec2 uv2 = fragCoord/iResolution.xy;
    col = min(col,1.)*pow(16.*uv2.x*uv2.y*(1.-uv2.x)*(1.-uv2.y), .0625);

    fragColor = vec4(sqrt(clamp(col,0.,1.)), 1);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}`

function compilar(gl: WebGL2RenderingContext, tipo: number, fuente: string) {
  const sh = gl.createShader(tipo)
  if (!sh) return null
  gl.shaderSource(sh, fuente)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('Dunas: error al compilar', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

type Opciones = {
  container: HTMLElement
  /** Fracción de los píxeles reales que se dibuja. Menos es más rápido. */
  escala?: number
}

export class DunesShader {
  private gl: WebGL2RenderingContext | null = null
  private lienzo: HTMLCanvasElement
  private programa: WebGLProgram | null = null
  private uResolucion: WebGLUniformLocation | null = null
  private uTiempo: WebGLUniformLocation | null = null
  private cuadro = 0
  private vivo = false
  private escala: number
  private t0 = 0

  /** false si el navegador no trae WebGL2 o el shader no compila. */
  readonly listo: boolean

  constructor({ container, escala = 0.62 }: Opciones) {
    this.escala = escala
    this.lienzo = document.createElement('canvas')
    this.lienzo.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    container.appendChild(this.lienzo)

    const gl = this.lienzo.getContext('webgl2', { antialias: false, depth: false })
    if (!gl) {
      this.listo = false
      return
    }
    this.gl = gl

    const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE)
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO)
    if (!vs || !fs) {
      this.listo = false
      return
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Dunas: error al enlazar', gl.getProgramInfoLog(prog))
      this.listo = false
      return
    }
    this.programa = prog
    gl.useProgram(prog)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPosition')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    this.uResolucion = gl.getUniformLocation(prog, 'iResolution')
    this.uTiempo = gl.getUniformLocation(prog, 'iTime')

    this.medir = this.medir.bind(this)
    this.dibujar = this.dibujar.bind(this)
    window.addEventListener('resize', this.medir)
    this.medir()

    this.listo = true
  }

  private medir() {
    const gl = this.gl
    if (!gl) return
    /* Se dibuja por debajo de la resolución real: el raymarcher da 96 pasos de
       traza por píxel y a pantalla completa no llega a 60 fps en un portátil
       sin gráfica dedicada. La escena es blanda y el reescalado no se nota. */
    const factor = Math.min(window.devicePixelRatio || 1, 1.5) * this.escala
    this.lienzo.width = Math.max(1, Math.round(window.innerWidth * factor))
    this.lienzo.height = Math.max(1, Math.round(window.innerHeight * factor))
    gl.viewport(0, 0, this.lienzo.width, this.lienzo.height)
  }

  private dibujar(t: number) {
    const gl = this.gl
    if (!this.vivo || !gl) return
    if (!this.t0) this.t0 = t
    gl.uniform3f(this.uResolucion, this.lienzo.width, this.lienzo.height, 1)
    /* El reloj arranca adelantado: en el segundo cero la cámara está metida en
       la primera duna y no se ve el horizonte. */
    gl.uniform1f(this.uTiempo, (t - this.t0) * 0.001 + 6)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    this.cuadro = requestAnimationFrame(this.dibujar)
  }

  arrancar() {
    if (!this.listo || this.vivo) return
    this.vivo = true
    this.cuadro = requestAnimationFrame(this.dibujar)
  }

  destroy() {
    this.vivo = false
    cancelAnimationFrame(this.cuadro)
    window.removeEventListener('resize', this.medir)
    if (this.gl && this.programa) this.gl.deleteProgram(this.programa)
    /* Sin esto el contexto queda vivo aunque se quite el lienzo, y los
       navegadores sólo permiten un puñado de contextos WebGL a la vez. */
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext()
    this.lienzo.remove()
    this.gl = null
  }
}
