import { Fragment, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
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

  const isPublic = !isAuthenticated

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-950/70 backdrop-blur">
          <div className="container h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/ethiocareer.png"
                alt="EthioCareer Logo" 
                className="h-50 w-auto"
              />
            </Link>

            <div className="flex items-center gap-2">
              {/* ULTIMATE PROFESSIONAL THEME TOGGLE */}
             <button
                type="button"
                className="relative w-16 h-8 rounded-full bg-gradient-to-r from-sky-100/80 via-blue-50/60 to-amber-50/80 dark:from-gray-900/90 dark:via-indigo-900/60 dark:to-gray-800/90 shadow-xl shadow-gray-400/30 dark:shadow-black/40 overflow-hidden border border-gray-300/40 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/20 dark:hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                onClick={toggle}
                aria-label="Toggle theme"
              >
                {/* Sky Background Layer */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Day Sky - Realistic Blue Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-sky-300/90 via-blue-100/70 to-amber-100/60 transition-all duration-1000 ease-in-out ${isDark ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
                    {/* Sunlight Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-transparent to-orange-100/10"></div>
                  </div>
                  
                  {/* Night Sky - Realistic Dark Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/80 to-gray-900 transition-all duration-1000 ease-in-out ${isDark ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                    {/* Starry Sky Effect */}
                    <div className="absolute inset-0 opacity-70">
                      {[...Array(15)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute bg-white rounded-full ${isDark ? 'animate-pulse' : ''}`}
                          style={{
                            width: `${Math.random() * 1.5 + 0.5}px`,
                            height: `${Math.random() * 1.5 + 0.5}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: `${Math.random() * 2 + 1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Milky Way Effect */}
                    <div className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-sm rounded-full transition-opacity duration-1000 ${isDark ? 'opacity-50' : 'opacity-0'}`}></div>
                  </div>
                </div>

                {/* Toggle Handle - The Celestial Body */}
                <div className={`absolute top-1/2 w-7 h-7 -translate-y-1/2 rounded-full transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] overflow-hidden ${
                  isDark 
                    ? 'left-[calc(100%-1.9rem)] shadow-[0_0_15px_rgba(96,165,250,0.5)]' 
                    : 'left-1 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                }`}>
                  {/* SUN - Realistic */}
                  <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100 rotate-0'}`}>
                    {/* Sun Core - Hot Center */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500"></div>
                    
                    {/* Sun Surface - Granular Texture */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fde04720_1px,transparent_1px),radial-gradient(circle_at_70%_70%,#fb923c20_1px,transparent_1px)] bg-[length:10px_10px]"></div>
                    
                    {/* Sun Corona - Outer Glow */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-300/40 via-amber-400/30 to-orange-500/20 blur-md"></div>
                    
                    {/* Sun Flares */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`flare-${i}`}
                        className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-gradient-to-b from-yellow-300 via-amber-400 to-transparent rounded-full"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-14px)`,
                          transformOrigin: 'center'
                        }}
                      ></div>
                    ))}
                    
                    {/* Sunspots */}
                    <div className="absolute w-1 h-1 rounded-full bg-orange-600/50 top-2 left-3"></div>
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-600/40 bottom-3 right-2"></div>
                  </div>

                  {/* MOON - Realistic */}
                  <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-180'}`}>
                    {/* Moon Base - Gray Surface */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100"></div>
                    
                    {/* Moon Texture - Craters */}
                    <div className="absolute inset-0 rounded-full">
                      {/* Large Crater */}
                      <div className="absolute w-3 h-3 rounded-full bg-gray-400/30 top-1/4 left-1/4 blur-[1px]"></div>
                      {/* Medium Crater */}
                      <div className="absolute w-2 h-2 rounded-full bg-gray-500/20 bottom-1/3 right-1/3 blur-[0.5px]"></div>
                      {/* Small Craters */}
                      <div className="absolute w-1 h-1 rounded-full bg-gray-500/30 top-3/4 left-1/2"></div>
                      <div className="absolute w-0.5 h-0.5 rounded-full bg-gray-400/40 bottom-1/4 left-1/3"></div>
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-gray-300/20 top-1/3 right-1/4 blur-[1px]"></div>
                    </div>
                    
                    {/* Moon Shadow - Terminator Line */}
                    <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-gray-900/40 to-transparent rounded-r-full"></div>
                    
                    {/* Moon Glow - Cold Light */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gray-300/20 via-blue-200/10 to-gray-100/10 blur-sm"></div>
                  </div>
                  
                  {/* Handle Border */}
                  <div className="absolute inset-0 rounded-full border border-gray-300/30 dark:border-gray-600/40"></div>
                </div>

                {/* Horizon Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
                  {/* Day Horizon - Clouds */}
                  <div className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${isDark ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className="absolute bottom-0 left-2 w-3 h-1.5 rounded-full bg-white/90 blur-[1px]"></div>
                    <div className="absolute bottom-0.5 right-3 w-2 h-1 rounded-full bg-white/80 blur-[1px]"></div>
                    <div className="absolute bottom-0 left-8 w-2.5 h-1.2 rounded-full bg-white/70 blur-[1px]"></div>
                  </div>
                  
                  {/* Night Horizon - Mountains */}
                  <div className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${isDark ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="absolute bottom-0 left-1 w-4 h-2 bg-gradient-to-r from-gray-800/70 to-gray-900/60 rounded-tl-md rounded-tr-sm clip-path-polygon"></div>
                    <div className="absolute bottom-0 right-2 w-3 h-1.5 bg-gradient-to-l from-gray-800/70 to-gray-900/60 rounded-tr-md rounded-tl-sm"></div>
                    <div className="absolute bottom-0 left-8 w-2 h-1 bg-gradient-to-r from-gray-800/60 to-gray-900/50 rounded-t-sm"></div>
                  </div>
                </div>

                {/* Shooting Star (Random Appearance) */}
                <div className={`absolute top-2 left-4 w-4 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full transition-all duration-300 ${isDark ? 'opacity-100' : 'opacity-0'} animate-[shooting_3s_ease-in-out_infinite]`}></div>
              </button>

              {location.pathname !== '/login' && (
                <Link className="btn btn-secondary" to="/login">
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link className="btn btn-primary" to="/register">
                  Create account
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 pb-8">
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