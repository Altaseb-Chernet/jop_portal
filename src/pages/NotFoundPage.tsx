import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="card">
          <div className="text-2xl font-bold">Page not found</div>
          <div className="mt-2 text-gray-600">The page you are looking for does not exist.</div>
          <Link className="btn btn-primary mt-4 inline-block" to="/">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
