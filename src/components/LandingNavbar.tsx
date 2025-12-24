import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, signOut } = useAuth()
  const { isDark, toggle } = useTheme()

  const navigation = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Pricing', to: '/pricing' },
    { name: 'Contact Us', to: '/contact' },
  ]

  function handleLogout() {
    setIsOpen(false)
    signOut()
  }

  return (
    <nav className="bg-white/90 dark:bg-gray-950/80 fixed w-full z-50 top-0 border-b border-gray-200/70 dark:border-gray-800 backdrop-blur">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 pl-2 md:pl-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <img src="/ethiocareer.png" alt="EthioCareer Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-300 hidden md:block">
                EthioCareer
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-2">
              {navigation.map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={
                      (active
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300') +
                      ' px-4 py-3 rounded-md text-md font-medium transition-all duration-200 relative group mx-1'
                    }
                  >
                    {item.name}
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-200 group-hover:w-4/5" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3 pr-2 md:pr-0">
            <div className="hidden md:flex items-center space-x-3">
              <button
                type="button"
                onClick={toggle}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-800 ml-2">
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                  >
                    <User size={18} className="mr-2" />
                    <span className="font-medium">{user?.firstName ?? 'Profile'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-800 ml-2">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-gray-50 dark:bg-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border-2 border-primary-600 hover:border-primary-700 dark:border-primary-700 dark:hover:border-primary-600 shadow-sm"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center pl-2">
              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 bg-gray-50 dark:bg-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <button
                type="button"
                onClick={toggle}
                className="w-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 bg-gray-50 dark:bg-gray-900"
              >
                {isDark ? (
                  <span className="flex items-center gap-2">
                    <Sun size={18} /> Light
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Moon size={18} /> Dark
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 flex-grow mr-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} className="mr-3" />
                    <span className="font-medium">{user?.firstName ?? 'Profile'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="text-center text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-3 rounded-lg text-base font-medium bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-center px-4 py-3 rounded-lg text-base font-medium border-2 border-primary-600 hover:border-primary-700 dark:border-primary-700 dark:hover:border-primary-600 shadow-sm transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
