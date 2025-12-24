import { Fragment, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { Footer } from './Footer'

export function Layout() {
  const { isAuthenticated } = useAuth()
  const { toggle, isDark } = useTheme()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [publicMenuOpen, setPublicMenuOpen] = useState(false)

  const isPublic = !isAuthenticated

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-30 border-b border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-950/80 backdrop-blur">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex-shrink-0 pl-2 md:pl-0">
              <Link to="/" className="flex items-center gap-2" onClick={() => setPublicMenuOpen(false)}>
                <img 
                  src="/ethiocareer.png"
                  alt="EthioCareer Logo" 
                  className="h-10 w-auto"
                />
                <span className="text-2xl font-bold text-primary-700 dark:text-primary-300 hidden md:block">
                  EthioCareer
                </span>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center space-x-2">
                {[
                  { name: 'Home', to: '/' },
                  { name: 'About', to: '/about' },
                  { name: 'Pricing', to: '/pricing' },
                  { name: 'Contact Us', to: '/contact' },
                ].map((item) => {
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
                      <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-200 group-hover:w-4/5"></span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pr-2 md:pr-0">
              <button
                type="button"
                onClick={toggle}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800 ml-2">
                {location.pathname !== '/login' && (
                  <Link
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-gray-50 dark:bg-gray-900"
                    to="/login"
                  >
                    Login
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border-2 border-primary-600 hover:border-primary-700 dark:border-primary-700 dark:hover:border-primary-600 shadow-sm"
                    to="/register"
                  >
                    Create account
                  </Link>
                )}
              </div>

              <div className="md:hidden flex items-center pl-2">
                <button
                  type="button"
                  onClick={() => setPublicMenuOpen((v) => !v)}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {publicMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {publicMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="px-4 pt-3 pb-6 space-y-2">
              {[
                { name: 'Home', to: '/' },
                { name: 'About', to: '/about' },
                { name: 'Pricing', to: '/pricing' },
                { name: 'Contact Us', to: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 bg-gray-50 dark:bg-gray-900"
                  onClick={() => setPublicMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  to="/login"
                  className="text-center text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-3 rounded-lg text-base font-medium bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                  onClick={() => setPublicMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-center px-4 py-3 rounded-lg text-base font-medium border-2 border-primary-600 hover:border-primary-700 dark:border-primary-700 dark:hover:border-primary-600 shadow-sm transition-colors duration-200"
                  onClick={() => setPublicMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className={(location.pathname === '/' ? 'pt-0' : 'pt-20') + ' flex-1 pb-8'}>
          <Outlet />
        </main>
        <Footer />
      </div>
    )
  }

  useEffect(() => {
    ;(window as any).__jpCloseMobileSidebar = () => setMobileOpen(false)
    return () => {
      ;(window as any).__jpCloseMobileSidebar = undefined
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        </div>

        <Transition.Root show={mobileOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 md:hidden" onClose={setMobileOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="max-w-[264px] w-full">
                  <Sidebar collapsed={false} onToggle={() => undefined} />
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-1" onClick={() => setMobileOpen(false)} />
            </div>
          </Dialog>
        </Transition.Root>

        <div className="flex-1 min-w-0">
          <TopNavbar onMobileMenu={() => setMobileOpen(true)} />
          <main className="pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}