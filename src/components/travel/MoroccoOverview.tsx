import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import { LineReveal } from '../fx/LineReveal'
import { ScrollScene, ScrollSceneGroup } from '../fx/ScrollScene'
import './MoroccoOverview.css'

type Props = {
  /** Acción centrada sobre el texto. Sin valor, el bloque no muestra CTA. */
  to?: string
  linkLabel?: string
}

/**
 * Cierre editorial de la portada: la acción hacia el catálogo, la franja de
 * fotografía con el rótulo y el texto largo de «Descubre Marruecos», que ya no
 * es prosa corrida: se lee escena a escena con el mismo gesto que el relato de
 * Marruecos, renglón a renglón y gobernado por el scroll.
 *
 * Vivía dentro de `PackShowcase`. Al sustituir el carril de tarjetas por el
 * slider, esta mitad no tenía por qué irse con él: es prosa de posicionamiento
 * y sigue siendo la única salida de la portada hacia el catálogo.
 */
export function MoroccoOverview({ to = '/packs', linkLabel = 'Ver todos los viajes' }: Props) {
  return (
    <section className="pack-showcase">
      <div className="pack-showcase-inner container">
        <div className="pack-showcase-closing">
          {to && (
            <Link to={to} onClick={lockNav} className="btn btn-outline pack-showcase-link">
              {linkLabel}
            </Link>
          )}

          <div className="pack-showcase-discover">
            {/* El rótulo entra por la fotografía, apoyado en el filo izquierdo:
                la misma calle a la que mira el texto que viene debajo. */}
            <div className="pack-showcase-discover-band">
              <img
                src="/images/marruecos.webp"
                alt="Calle empedrada de casas azules con buganvillas y el sol poniéndose tras las montañas"
                loading="lazy"
                decoding="async"
              />
              <h3>Descubre Marruecos</h3>
            </div>
          </div>
        </div>
      </div>

      <ScrollSceneGroup className="overview">
        <ScrollScene className="overview__lead-escena scroll-scene">
          <LineReveal as="p" className="overview__lead">
            Hacer turismo en Marruecos es adentrarse en un destino lleno de
            contrastes. Un país único donde las antiguas medinas, mezquitas y
            zocos tradicionales conviven en armonía con impresionantes paisajes
            naturales.
          </LineReveal>
        </ScrollScene>

        <ScrollScene className="overview__dos scroll-scene" hold={1.2}>
          <div className="overview__col">
            <LineReveal as="p" className="overview__titular">
              Desde los mágicos desiertos y los fértiles oasis del Gran Sur,
              hasta las playas del Atlántico y las cumbres nevadas del Atlas,
              Marruecos ofrece una diversidad inolvidable.
            </LineReveal>
          </div>
          <div className="overview__col">
            <LineReveal as="p" className="overview__subhead">
              <strong>Los imprescindibles de nuestras rutas por Marruecos:</strong>
            </LineReveal>
            <LineReveal as="p" delay={0.08}>
              <strong>Marrakech, la Ciudad Imperial:</strong> Explora su
              fascinante medina, recorre los colores de sus zocos y vive el
              ambiente único de la plaza Jemaa el-Fna junto a la majestuosa
              Mezquita Koutoubia.
            </LineReveal>
            <LineReveal as="p" delay={0.16}>
              <strong>Essaouira y la Costa Atlántica:</strong> Descubre la joya
              bohemia del Atlántico. Pasea por su medina blanca amurallada,
              contempla su puerto pesquero y disfruta del ambiente marino.
            </LineReveal>
            <LineReveal as="p" delay={0.24}>
              <strong>Ruta de las Kasbahs y el Gran Sur:</strong> Recorre
              antiguas fortalezas bereberes de arcilla y piedra, explora
              palmerales infinitos y vive la magia inolvidable de las dunas del
              Sáhara.
            </LineReveal>
          </div>
        </ScrollScene>

        <ScrollScene className="overview__prosa scroll-scene" hold={1.2}>
          <div className="overview__columna-prosa">
            <LineReveal as="p" className="overview__destacado">
              Marruecos es, sin duda, el más cercano de los grandes viajes.
            </LineReveal>
            <LineReveal as="p" delay={0.08}>
              Marruecos es una fascinante combinación de modernidad y tradición.
              Un país de contrastes donde explorar medinas históricas, vibrantes
              zocos y grandiosas fortalezas. Su variada geografía abarca desde
              los mágicos desiertos del Sáhara y los oasis del Gran Sur, hasta la
              brisa marina del Atlántico y majestuosas cordilleras montañosas.
            </LineReveal>
            <LineReveal as="p" delay={0.16}>
              Durante tu <strong>viaje a Marruecos</strong>, podrás sumergirte en
              el encanto imperial de <strong>Marrakech</strong> y admirar su
              patrimonio histórico. En la costa, te espera la encantadora{' '}
              <strong>Essaouira</strong>, con sus murallas costeras y su ambiente
              relajado. Adentrándote hacia el interior, recorrerás la mítica{' '}
              <strong>Ruta de las Kasbahs</strong>, repleta de fortalezas
              bereberes tradicionales y palmerales que se recortan sobre las
              dunas del desierto.
            </LineReveal>
          </div>
        </ScrollScene>

        <ScrollScene className="overview__cierre scroll-scene" hold={0.8}>
          <LineReveal as="p" className="overview__titular overview__titular--centrado">
            Déjate sorprender por la hospitalidad local y convierte tu próxima
            escapada a Marruecos en un viaje memorable.
          </LineReveal>
        </ScrollScene>
      </ScrollSceneGroup>
    </section>
  )
}
