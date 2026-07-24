import './SplitTitle.css'

/**
 * El recurso tipográfico que define a Horizonte: dentro de un titular en
 * versales, las palabras de enlace bajan a caja baja y a menos de la mitad de
 * tamaño. La frase deja de ser un bloque uniforme y se lee como una línea de
 * revista.
 *
 *   PANORAMIC views, SPACIOUS LAYOUTS, gated COMMUNITY
 *
 * Las palabras menores se marcan entre llaves:
 *
 *   <SplitTitle text="RUTAS {privadas} POR EL SUR {de} MARRUECOS" />
 */

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  align?: 'left' | 'center'
  size?: 'display' | 'wordmark'
  className?: string
}

export function SplitTitle({
  text,
  as: Tag = 'h2',
  align = 'left',
  size = 'display',
  className = '',
}: Props) {
  /* El logotipo del hero se reparte letra a letra de borde a borde. No hay
     forma de justificar una sola palabra con CSS, así que se separa en
     caracteres y se dejan repartir por flex. */
  if (size === 'wordmark') {
    return (
      <Tag className={`split-title split-title--wordmark ${className}`}>
        {Array.from(text).map((ch, i) => (
          <span key={i} className="split-title__char">
            {ch}
          </span>
        ))}
      </Tag>
    )
  }

  // Parte por los tramos entre llaves conservando el separador, para no
  // perder los espacios entre palabras.
  const parts = text.split(/(\{[^}]*\})/g).filter(Boolean)

  return (
    <Tag className={`split-title split-title--${size} split-title--${align} ${className}`}>
      {parts.map((part, i) =>
        part.startsWith('{') ? (
          <span key={i} className="split-title__minor">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Tag>
  )
}
