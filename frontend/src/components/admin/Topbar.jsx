import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";

const Topbar = ({ setIsOpen }) => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="
        h-[72px]
        px-4
        md:px-6
        flex
        items-center
        justify-between
        bg-[#3a3a3a]
        border-b-4
        border-[#686868]
        shadow-[inset_0_-3px_8px_rgba(0,0,0,.35)]
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            md:hidden
            casio-btn
            w-10
            h-10
            flex
            items-center
            justify-center
            text-lg
          "
        >
          ☰
        </button>
      </div>

      {/* CENTER */}
      <div className="hidden lg:flex items-center">
        <div
          className="
            lcd-screen
            px-4
            py-2
            flex
            items-center
            gap-4
            text-xs
          "
        >
          <span>BAT ████████</span>
          <span>MEM 128KB</span>
          <span>SIG █████</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* fake indicator LEDs */}
        <div className="hidden md:flex gap-2 mr-2">
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
          <div className="w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047]" />
        </div>
        <Link to="/" className="casio-btn px-3 py-2 text-xs tracking-widest">
          SITE
        </Link>
        i
        <button
          onClick={handleLogout}
          className="
            casio-btn
            px-3
            py-2
            text-xs
            tracking-widest
          "
        >
          EXIT
        </button>
      </div>
    </header>
  );
};

export default Topbar;
