import { NavLink } from "react-router";

const navLinks = [
  { name: "DASHBOARD", path: "/admin/dashboard" },
  { name: "PROJECTS", path: "/admin/edit-project" },
  { name: "SKILLS", path: "/admin/edit-skills" },
  { name: "MESSAGES", path: "/admin/messages" },
  { name: "RESUME", path: "/admin/edit-resume" },
];

const SidebarLinks = ({ onNavigate }) => {
  return (
    <nav className="flex flex-col gap-3">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `
            block
            px-4
            py-3
            transition-all
            duration-150
            border-2
            text-sm
            tracking-widest

            ${
              isActive
                ? `
                  lcd-screen-lit
                  text-black
                  font-bold
                  scale-[1.02]
                `
                : `
                  bg-[#4a4a4a]
                  border-[#222]
                  text-gray-100
                  hover:bg-[#5b5b5b]
                  active:translate-y-[1px]
                `
            }
          `
          }
        >
          ▸ {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* DESKTOP SIDEBAR */}
     <aside
  className="
    hidden
    md:flex
    flex-col
    w-72
    h-screen
    sticky
    top-0
    p-4
    bg-[#3b3b3b]
    border-r-4
    border-[#666]
  "
>
        {/* LCD HEADER */}
        <div className="lcd-screen p-4 mb-6">
          <h2 className="casio-display text-5xl leading-none">
            ADMIN
          </h2>

          <p className="text-xs tracking-[0.25em] mt-2">
            TERMINAL V1.0
          </p>
        </div>

        {/* NAVIGATION */}
        <SidebarLinks />

        {/* DEVICE STATUS */}
        <div className="lcd-screen mt-auto p-3 text-xs mb-4">
          <div>BATTERY ████████ 92%</div>
          <div>STATUS ONLINE</div>
          <div>MEMORY 128KB</div>
          <div>MODE ADMIN</div>
        </div>

        {/* PORTFOLIO LINK */}
        <NavLink to="/">
          <div
            className="
            bg-[#4a4a4a]
            border-2
            border-[#222]
            text-center
            py-3
            text-sm
            tracking-widest
            text-white
            hover:bg-[#5b5b5b]
          "
          >
            ← VIEW PORTFOLIO
          </div>
        </NavLink>
      </aside>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="
            w-72
            h-full
            bg-[#3b3b3b]
            border-r-4
            border-[#666]
            p-4
          "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="
              w-full
              text-right
              text-2xl
              mb-4
              text-white
            "
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <div className="lcd-screen p-4 mb-6">
              <h2 className="casio-display text-5xl leading-none">
                ADMIN
              </h2>

              <p className="text-xs tracking-[0.25em] mt-2">
                TERMINAL V1.0
              </p>
            </div>

            <SidebarLinks
              onNavigate={() => setIsOpen(false)}
            />

            <div className="lcd-screen p-3 text-xs mt-6 mb-4">
              <div>BATTERY ████████ 92%</div>
              <div>STATUS ONLINE</div>
              <div>MEMORY 128KB</div>
              <div>MODE ADMIN</div>
            </div>

            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="
                bg-[#4a4a4a]
                border-2
                border-[#222]
                text-center
                py-3
                text-sm
                tracking-widest
                text-white
              "
              >
                ← VIEW PORTFOLIO
              </div>
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;