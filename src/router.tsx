import { createBrowserRouter } from 'react-router'
import { SiteLayout } from './components/layout/SiteLayout'
import { HomePage } from './pages/HomePage'
import { DestinosPage } from './pages/DestinosPage'
import { CiudadPage } from './pages/CiudadPage'
import { PacksPage } from './pages/PacksPage'
import { PuntosInteresPage } from './pages/PuntosInteresPage'
import { PackHubPage } from './pages/PackHubPage'
import { ItinerarioPage } from './pages/ItinerarioPage'
import { DetallesPage } from './pages/DetallesPage'
import { ElViajePage } from './pages/ElViajePage'
import { ConsejosPage } from './pages/ConsejosPage'
import { NosotrosPage } from './pages/NosotrosPage'
import { ContactoPage } from './pages/ContactoPage'
import { ReservaPage } from './pages/ReservaPage'
import { TuViajePage } from './pages/TuViajePage'
import { CreditosPage } from './pages/CreditosPage'

export const router = createBrowserRouter([
  {
    // Páginas con estructura estándar: Cabecera, Hero, bloques, Footer
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },                              // pág. 1
      { path: '/destinos', element: <DestinosPage /> },                  // pág. 2
      { path: '/destinos/:slug', element: <CiudadPage /> },              // pág. 3
      { path: '/packs', element: <PacksPage /> },                        // pág. 4
      { path: '/puntos-de-interes', element: <PuntosInteresPage /> },    // pág. 5
      { path: '/packs/:slug/itinerario', element: <ItinerarioPage /> },  // pág. 6
      { path: '/packs/:slug/detalles', element: <DetallesPage /> },      // pág. 7
      { path: '/packs/:slug/viaje', element: <ElViajePage /> },          // pág. 8
      { path: '/consejos', element: <ConsejosPage /> },                  // pág. 10
      { path: '/nosotros', element: <NosotrosPage /> },
      { path: '/contacto', element: <ContactoPage /> },
      { path: '/packs/:slug', element: <PackHubPage /> },                // pág. 11
      { path: '/creditos', element: <CreditosPage /> },
    ],
  },
  // Páginas con layout propio (9, 12/13)
  { path: '/reserva/:slug', element: <ReservaPage /> },                  // pág. 9
  { path: '/viaje/:quoteId', element: <TuViajePage /> },                 // pág. 12 (13 = pestaña)
])
