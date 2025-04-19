"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import logoSvg from "../assets/logo_svg.svg"

const Navbar = ({ openWalletModal, isLoggedIn, userRole, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768)
  const location = useLocation()

  // Atualiza o estado isMobileScreen quando a janela é redimensionada
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  // Função para verificar se um link está ativo
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 shadow-sm">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src={logoSvg || "/placeholder.svg"} alt="SeedSafe" className="h-10" />
          </Link>
          <Link to="/">
            <span className="font-bold text-3xl">
              Seed<em className="text-green-700 not-italic">Safe</em>
            </span>
          </Link>
        </div>

        {/* Botão de menu móvel - apenas visível em telas pequenas */}
        {isMobileScreen && (
          <button
            onClick={toggleMobileMenu}
            className="text-2xl p-2 focus:outline-none transition-transform duration-300"
            aria-label="Toggle menu"
          >
            <i
              className={`fas ${isMobileMenuOpen ? "fa-times rotate-180" : "fa-bars"} transition-transform duration-300`}
            ></i>
          </button>
        )}

        {/* Links de navegação e botões - visíveis em desktop */}
        {!isMobileScreen && (
          <div className="flex items-center gap-10">
            <div className="flex gap-10">
              {location.pathname === "/" ? (
                <>
                  <a
                    href="#how-it-works"
                    className="font-medium text-lg relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all"
                  >
                    How It Works
                  </a>
                  <a
                    href="#benefits"
                    className="font-medium text-lg relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all"
                  >
                    Benefits
                  </a>
                  <a
                    href="#products"
                    className="font-medium text-lg relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all"
                  >
                    Products
                  </a>
                  <a
                    href="#testimonials"
                    className="font-medium text-lg relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all"
                  >
                    Testimonials
                  </a>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`font-medium text-lg relative hover:text-green-700 transition-colors ${isActive("/") ? "text-green-700" : ""}`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/marketplace"
                    className={`font-medium text-lg relative hover:text-green-700 transition-colors ${isActive("/marketplace") ? "text-green-700" : ""}`}
                  >
                    Marketplace
                  </Link>
                  <Link
                    to="/register"
                    className={`font-medium text-lg relative hover:text-green-700 transition-colors ${isActive("/register") ? "text-green-700" : ""}`}
                  >
                    Register Crop
                  </Link>
                  {userRole === "auditor" && (
                    <Link
                      to="/auditor"
                      className={`font-medium text-lg relative hover:text-green-700 transition-colors ${isActive("/auditor") ? "text-green-700" : ""}`}
                    >
                      Auditor Panel
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-green-700"></i>
                    </div>
                    <span className="text-sm font-medium">
                      {userRole === "auditor" ? "Auditor" : userRole === "producer" ? "Producer" : "Investor"}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="py-2 px-6 rounded-md font-semibold border-2 border-gray-200 hover:border-red-500 hover:text-red-500 hover:-translate-y-0.5 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="py-2 px-6 rounded-md font-semibold border-2 border-gray-200 hover:border-green-700 hover:text-green-700 hover:-translate-y-0.5 transition-all">
                    Login
                  </button>
                  <button
                    onClick={openWalletModal}
                    className="py-2 px-6 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all"
                  >
                    Connect Wallet
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu móvel com animação de abertura */}
      {isMobileScreen && (
        <div
          className={`absolute top-full left-0 w-full bg-white shadow-md overflow-hidden transform transition-transform duration-300 ease-in-out origin-top z-40 ${
            isMobileMenuOpen ? "scale-y-100" : "scale-y-0"
          }`}
        >
          <div className="flex flex-col gap-4 p-4">
            {location.pathname === "/" ? (
              <>
                <a href="#how-it-works" className="font-medium hover:text-green-700 transition-colors">
                  How It Works
                </a>
                <a href="#benefits" className="font-medium hover:text-green-700 transition-colors">
                  Benefits
                </a>
                <a href="#products" className="font-medium hover:text-green-700 transition-colors">
                  Products
                </a>
                <a href="#testimonials" className="font-medium hover:text-green-700 transition-colors">
                  Testimonials
                </a>
              </>
            ) : (
              <>
                <Link to="/" className="font-medium hover:text-green-700 transition-colors">
                  Home
                </Link>
                <Link to="/marketplace" className="font-medium hover:text-green-700 transition-colors">
                  Marketplace
                </Link>
                <Link to="/register" className="font-medium hover:text-green-700 transition-colors">
                  Register Crop
                </Link>
                {userRole === "auditor" && (
                  <Link to="/auditor" className="font-medium hover:text-green-700 transition-colors">
                    Auditor Panel
                  </Link>
                )}
              </>
            )}

            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-green-700"></i>
                  </div>
                  <span className="text-sm font-medium">
                    {userRole === "auditor" ? "Auditor" : userRole === "producer" ? "Producer" : "Investor"}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="py-2 px-6 rounded-md font-semibold border-2 border-gray-200 hover:border-red-500 hover:text-red-500 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="py-2 px-6 rounded-md font-semibold border-2 border-gray-200 hover:border-green-700 hover:text-green-700 transition-all">
                  Login
                </button>
                <button
                  onClick={openWalletModal}
                  className="py-2 px-6 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 transition-all"
                >
                  Connect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
