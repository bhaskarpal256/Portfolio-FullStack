import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const navButtonClass = ({ isActive }) => `
    casio-btn
    min-w-[110px]
    px-4
    py-2 
    text-xs
    tracking-[0.25em]
    text-center
    transition-all
    duration-150
    ${isActive ? "brightness-110 ring-2 ring-[#9bb88a]" : ""}
    ${isActive ? "casio-btn-active" : ""}
  `;

  const NavButton = ({ to, label }) => (
    <NavLink to={to} className={navButtonClass}>
      {({ isActive }) => (
        <div className="flex items-center justify-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isActive
                ? "bg-[#b5ff8a] shadow-[0_0_12px_#05df72]"
                : "bg-[#7d8d73] shadow-[0_0_4px_#7d8d73]"
            }
         `}
          />
          <span>{label}</span>
        </div>
      )}
    </NavLink>
  );

  return (
    <nav className="w-full border-b border-[#5d6e5d] bg-[#2f312d] relative z-50">
      {/* Top Bar */}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side */}

          <div className="flex items-center gap-4">
            {/* Desktop Nav */}

            <div className="hidden lg:flex items-center gap-3">
              <NavButton to="/" label="HOME" />
              <NavButton to="/projects" label="PROJECTS" />
              <NavButton to="/resume" label="RESUME" />
              <NavButton to="/contact" label="CONTACT" />
            </div>

            {/* Mobile Hamburger */}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="
                lg:hidden
                casio-btn
                px-3
                py-0.5
                text-lg
                cursor-pointer
              "
            >
              ☰
            </button>
          </div>

          {/* Right Side */}

          <div className="flex items-center gap-3">
            {/* Fake LEDs */}

            <div className="hidden md:flex gap-2 mr-2">
              {/* READY LED */}
              <div
                className={`
      w-3 h-3 rounded-full transition-all duration-300
      ${
        !isLoginPage
          ? "bg-yellow-300 shadow-[0_0_12px_#fde047]"
          : "bg-[#504d30]"
      }
    `}
              />

              {/* AUTH LED */}
              <div
                className={`
      w-3 h-3 rounded-full transition-all duration-300
      ${isLoginPage ? "bg-green-400 shadow-[0_0_12px_#4ade80]" : "bg-[#405040]"}
    `}
              />
            </div>

            {user ? (
  <div className="flex items-center gap-3">
    <NavLink
      to="/admin/dashboard"
      className={({ isActive }) => `
        casio-btn
        min-w-[140px]
        px-4
        py-2
        text-xs
        tracking-[0.25em]
        text-center
        ${isActive ? "brightness-110 ring-2 ring-[#9bb88a]" : ""}
        ${isActive ? "casio-btn-active" : ""}
      `}
    >
      ADMIN PANEL
    </NavLink>

    <button
      onClick={logout}
      className="
        casio-btn
        min-w-[100px]
        px-4
        py-2
        text-xs
        tracking-[0.25em]
        text-center
      "
    >
      EXIT
    </button>
  </div>
) : (
  <NavLink
    to="/login"
    className={({ isActive }) => `
      casio-btn
      min-w-[120px]
      px-4
      py-2
      text-xs
      tracking-[0.25em]
      text-center
      ${isActive ? "brightness-110 ring-2 ring-[#9bb88a]" : ""}
      ${isActive ? "casio-btn-active" : ""}
    `}
  >
    LOGIN
  </NavLink>
)}
          </div>
        </div>
      </div>

      {/* Status Strip */}

      <div
        className="
        
          border-t
          border-[#5d6e5d]
          bg-[#2b2c28]
          relative
          overflow-hidden
          cursor-pointer
        "
      >
        {/* Scanline Overlay */}

        <div
          className="
            absolute
            inset-0
            pointer-events-none
            opacity-20
            bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)]
            bg-[length:100%_4px]
          "
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 relative">
          <div className="text-xs tracking-[0.25em] text-[#a7ba8f] opacity-70">
            CURRENT MODE :
            <span className="casio-display !text-[#a7ba8f] lcd-blink ml-2">
              PORTFOLIO
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div
          className="
            lg:hidden
            border-t
            border-[#5d6e5d]
            bg-[#2f312d]
            px-4
            py-4
          "
        >
          <div className="flex flex-col gap-3">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={navButtonClass}
            >
              HOME
            </NavLink>

            <NavLink
              to="/projects"
              onClick={() => setIsOpen(false)}
              className={navButtonClass}
            >
              PROJECTS
            </NavLink>

            <NavLink
              to="/resume"
              onClick={() => setIsOpen(false)}
              className={navButtonClass}
            >
              RESUME
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={navButtonClass}
            >
              CONTACT
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
