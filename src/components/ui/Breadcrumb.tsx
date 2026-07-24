import { Link } from 'react-router'
import './Breadcrumb.css'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      {items.map((c, i) => (
        <span key={c.label} className="breadcrumb-item">
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          {i < items.length - 1 && <span className="breadcrumb-sep">/</span>}
        </span>
      ))}
    </nav>
  )
}
