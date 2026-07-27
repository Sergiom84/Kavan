import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/fx/RevealText'
import './LegalPage.css'

type Props = {
  title: string
  subtitle: string
  image: string
  /** Epígrafes que tendrá el documento cuando llegue el texto definitivo. */
  epigrafes: string[]
}

/**
 * Las cuatro páginas legales del pie comparten estructura y sólo cambian el
 * título y los epígrafes.
 *
 * El texto está deliberadamente sin redactar: son documentos con efectos
 * jurídicos —condiciones de contratación, tratamiento de datos y garantía de
 * insolvencia, que en viajes combinados es obligatoria— y los tiene que dar la
 * agencia o su asesoría, no inventarlos la web. Lo que queda montado es el
 * esqueleto: ruta, hero, epígrafes y el aviso de que falta el contenido.
 */
export function LegalPage({ title, subtitle, image, epigrafes }: Props) {
  return (
    <>
      <PageHero image={image} title={title} subtitle={subtitle} size="s" />

      <section className="legal container">
        <div className="legal-doc">
          <Reveal>
            <p className="legal-pendiente">
              Documento pendiente de redacción. El texto definitivo lo facilitará
              la agencia.
            </p>
          </Reveal>

          <Reveal>
            <ol className="legal-indice">
              {epigrafes.map((e) => (
                <li key={e}>
                  <h2>{e}</h2>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* Cada página con sus epígrafes. Los de insolvencia y condiciones siguen el
   guion del Real Decreto Legislativo 1/2007 para viajes combinados. */

export function CondicionesPage() {
  return (
    <LegalPage
      title="Condiciones generales"
      subtitle="Contratación de viajes combinados"
      image="art:stone:legal-condiciones"
      epigrafes={[
        'Organizador y datos de la agencia',
        'Información precontractual',
        'Inscripción y pago',
        'Precio y revisión de precios',
        'Qué incluye y qué no incluye',
        'Cesión de la reserva',
        'Modificaciones antes de la salida',
        'Cancelación por el viajero',
        'Cancelación por el organizador',
        'Responsabilidad y reclamaciones',
        'Documentación y requisitos de entrada',
        'Seguros',
        'Legislación aplicable y jurisdicción',
      ]}
    />
  )
}

export function PrivacidadPage() {
  return (
    <LegalPage
      title="Privacidad"
      subtitle="Tratamiento de datos personales"
      image="art:arch:legal-privacidad"
      epigrafes={[
        'Responsable del tratamiento',
        'Datos que se recogen',
        'Finalidad y base jurídica',
        'Plazos de conservación',
        'Destinatarios y cesiones',
        'Transferencias internacionales',
        'Derechos del interesado',
        'Reclamaciones ante la autoridad de control',
      ]}
    />
  )
}

export function CookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      subtitle="Qué se almacena en tu navegador"
      image="art:medina:legal-cookies"
      epigrafes={[
        'Qué es una cookie',
        'Cookies que utiliza este sitio',
        'Cookies de terceros',
        'Finalidad de cada cookie',
        'Cómo aceptarlas, rechazarlas o retirar el consentimiento',
        'Cómo eliminarlas desde el navegador',
      ]}
    />
  )
}

export function InsolvenciaPage() {
  return (
    <LegalPage
      title="Política de insolvencia"
      subtitle="Garantía frente a la insolvencia del organizador"
      image="art:oasis:legal-insolvencia"
      epigrafes={[
        'Garantía exigida a los viajes combinados',
        'Entidad garante y número de póliza',
        'Qué cubre la garantía',
        'Repatriación en caso de insolvencia',
        'Cómo reclamar',
        'Datos de contacto de la entidad garante',
      ]}
    />
  )
}
