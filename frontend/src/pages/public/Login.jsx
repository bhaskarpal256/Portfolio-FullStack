import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../../services/project.service.js";
import { useNavigate } from "react-router";
import { loginUser, getCurrentUser } from "../../services/auth.service.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [projects, setProjects] = useState([]);
  const [scanLoading, setScanLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();

        setProjects(response?.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setScanLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const analytics = useMemo(() => {
    const totalProjects = projects.length;

    const featuredProjects = projects.filter(
      (project) => project.isFeatured,
    ).length;

    const techFrequency = {};

    projects.forEach((project) => {
      project.techStack?.forEach((tech) => {
        techFrequency[tech] = (techFrequency[tech] || 0) + 1;
      });
    });

    const totalTechnologies = Object.keys(techFrequency).length;

    const mostUsedTech = Object.entries(techFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const healthScore =
      totalProjects > 0
        ? Math.min(
            100,
            Math.round(
              ((featuredProjects + totalTechnologies) / (totalProjects * 2)) *
                100,
            ),
          )
        : 0;

    return {
      totalProjects,
      featuredProjects,
      totalTechnologies,
      mostUsedTech,
      healthScore,
    };
  }, [projects]);

  const handleSubmit = async (e) => {
    console.log("LOGIN CLICKED");
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser(form);

      const { data } = await getCurrentUser();

      setUser(data.data);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative ">
      {/* Background Glow */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          opacity-20
        "
      >
        <div
          className="
             w-[40rem]
            h-[40rem]
            rounded-full
            bg-[#aaff78]
            blur-[12rem]
            mx-auto
            mt-20
            animate-pulse
          "
        />
      </div>

      {/* Main Terminal */}

     <div className="max-w-6xl mx-auto relative z-10">
  <div className="casio-panel p-2 md:p-4">
        <div className="lcd-screen lcd-breathe">
          {/* Top Header */}

          <div className="flex justify-between items-start border-b border-[#5d6e5d] pb-4">
            <div>
              <p className="text-[0.625rem] tracking-[0.35em] opacity-70">
                PORTFOLIO OPERATING SYSTEM
              </p>

              <h1 className="casio-display text-5xl tracking-[0.15em] mt-2">
                ADMIN TERMINAL
                <span className="cursor-blink">_</span>
              </h1>

              <p className="text-xs opacity-60 mt-2">VERSION 1.0.0</p>
            </div>


          {/* Body */}
            
          </div>

          <div className="grid md:grid-cols-[28rem_1fr] gap-8 mt-8">
            {/* RIGHT - LOGIN */}

            <div className="border border-[#5d6e5d] rounded p-6">
              <div className="mb-6">
                <p className="text-xs tracking-[0.25em] opacity-70">
                  ACCESS CONTROL
                </p>

                <h2 className="text-3xl casio-display mt-2">LOGIN</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs tracking-[0.2em] mb-2">
                    EMAIL
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="casio-input w-full"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] mb-2">
                    PASSWORD
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="casio-input w-full"
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm border border-red-700 rounded px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="casio-lcd-btn w-full"
                >
                  {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
                </button>
              </form>

              <div className="mt-6 border-t border-[#5d6e5d] pt-4 text-xs opacity-70">
                <div className="flex justify-between">
                  <span>STATUS</span>
                  <span>READY</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span>SECURITY</span>
                  <span>ENABLED</span>
                </div>
              </div>
            </div>

            {/* LEFT - SYSTEM DIAGNOSTICS */}

            <div className="space-y-6">
              <div>
                <div>
                  <p className="opacity-70 tracking-[0.25em] text-s">SYSTEM</p>

                  <h2 className="casio-display text-[clamp(1.5rem,3vw,2.5rem)]">
                    DIAGNOSTICS
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-[#5d6e5d] rounded p-4">
                    <p className="text-xs opacity-70">PROJECTS</p>

                    <p className="text-3xl casio-display">
                      {analytics.totalProjects}
                    </p>
                  </div>

                  <div className="border border-[#5d6e5d] rounded p-4">
                    <p className="text-xs opacity-70">FEATURED</p>

                    <p className="text-3xl casio-display">
                      {analytics.featuredProjects}
                    </p>
                  </div>

                  <div className="border border-[#5d6e5d] rounded p-4">
                    <p className="text-xs opacity-70">TECHS</p>

                    <p className="text-3xl casio-display">
                      {analytics.totalTechnologies}
                    </p>
                  </div>

                  <div className="border border-[#5d6e5d] rounded p-4">
                    <p className="text-xs opacity-70">HEALTH</p>

                    <p className="text-3xl casio-display">
                      {analytics.healthScore}%
                    </p>
                  </div>
                </div>
              </div>

              {/* TOP TECH */}

              <div className="border border-[#5d6e5d] rounded p-4">
                <p className="tracking-[0.2em] text-sm opacity-70 mb-4">
                  TOP TECHNOLOGIES
                </p>

                <div className="space-y-3">
                  {analytics.mostUsedTech.map(([tech, count]) => (
                    <div key={tech} className="flex justify-between">
                      <span>{tech}</span>

                      <span className="casio-display">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RUN SYSTEM SCAN */}

              <div className="border border-[#5d6e5d] rounded p-4">
                <p className="tracking-[0.2em] text-sm opacity-70 mb-3">
                  RUN SYSTEM SCAN
                </p>

                <button type="button" className="casio-lcd-btn">
                  {scanLoading ? "SCANNING..." : "SCAN COMPLETE"}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
