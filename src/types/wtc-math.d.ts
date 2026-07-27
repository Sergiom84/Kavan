/* wtc-math (dependencia de wtc-gl) no publica declaraciones de tipos: su
   package.json apunta a ficheros .d.ts que no están en el paquete. Aquí se
   declara sólo lo que usamos, para no tener que apagar el tipado.

   Vec2 expone `width`/`height` además de `x`/`y`: es la forma que lee el
   Renderer de wtc-gl al fijar las dimensiones del lienzo. */
declare module 'wtc-math' {
  export class Vec2 {
    constructor(x?: number, y?: number)
    x: number
    y: number
    width: number
    height: number
  }
}
