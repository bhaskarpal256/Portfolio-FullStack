import { NavLink } from "react-router";
import { getResume } from "../../services/resume.service";
import { useEffect, useState } from "react";
import LoadingScreen from "../../components/ui/LoadingScreen"

const Home = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchResume = async() => {
     const start = Date.now();
    try {
      const response = await getResume();
      setResume(response.data.data);
      console.log(resume)

    } catch (error) {
      console.error(error);
    } finally {
      const elapsed = Date.now() - start;

        const remaining = Math.max(400 - elapsed, 0);

        await new Promise((resolve) => setTimeout(resolve, remaining));

        setLoading(false);
    }
  } 
  fetchResume();
}, [])

 if (loading)
    return <LoadingScreen title="HOME" subtitle="LOADING HOME..." />;

  return (
    <div className="min-h-screen relative">

      {/* breathing glow */}

      <div className="fixed inset-0 pointer-events-none opacity-20">
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

      <div className="max-w-5xl mx-auto relative z-10">

        <div className="casio-panel p-2 md:p-4">

          <div className="lcd-screen lcd-breathe">

            {/* HEADER */}

            <div className="border-b border-[#5d6e5d] ">

              <p className="text-[0.625rem] tracking-[0.35em] opacity-70">
                SYSTEM TERMINAL
              </p>

              <h1
                className="
                  casio-display
                  text-[clamp(2rem,4vw,2.5rem)]
                  tracking-[0.10em]
                "
              >
                ROOT
              </h1>

              <div className="flex flex-wrap gap-4 text-sm ">

                <span>FULL STACK DEVELOPER</span>

                <span className="flex items-center gap-2">

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#05df72]
                      shadow-[0_0_10px_#05df72]
                      animate-pulse
                    "
                  />

                  ONLINE

                </span>

              </div>

            </div>
            
{/* SYSTEM MESSAGE */}

<div className="border-b border-[#5d6e5d] p-4">

  <h2 className="tracking-[0.25em] font-bold text-base mb-3">
    SYSTEM MESSAGE
  </h2>

  <p className="leading-relaxed">
    {resume?.summary}
  </p>

</div>

            {/* QUICK ACCESS */}

          <div className="border-b border-[#5d6e5d] p-4">

  <h2 className="tracking-[0.25em] text-sm mb-4">
    QUICK ACCESS TERMINAL
  </h2>

  <div
    className="
      grid
      sm:grid-cols-2
      gap-4
    "
  >

    <NavLink
      to="/projects"
      className="
        casio-btn
        h-28
        flex
        flex-col
        items-center
        justify-center
        gap-2
      "
    >
      <div
        className="
          w-3
          h-3
          rounded-full
          bg-[#05df72]
          shadow-[0_0_10px_#05df72]
        "
      />

      <span className="tracking-[0.25em]">
        PROJECTS
      </span>

      <span className="text-[10px] opacity-70">
        DATABASE
      </span>

    </NavLink>

    <NavLink
      to="/resume"
      className="
        casio-btn
        h-28
        flex
        flex-col
        items-center
        justify-center
        gap-2
      "
    >
      <div
        className="
          w-3
          h-3
          rounded-full
          bg-[#05df72]
          shadow-[0_0_10px_#05df72]
        "
      />

      <span className="tracking-[0.25em]">
        RESUME
      </span>

      <span className="text-[10px] opacity-70">
        DOSSIER
      </span>

    </NavLink>

    <NavLink
      to="/contact"
      className="
        casio-btn
        h-28
        flex
        flex-col
        items-center
        justify-center
        gap-2
      "
    >
      <div
        className="
          w-3
          h-3
          rounded-full
          bg-[#05df72]
          shadow-[0_0_10px_#05df72]
        "
      />

      <span className="tracking-[0.25em]">
        CONTACT
      </span>

      <span className="text-[10px] opacity-70">
        COMM LINK
      </span>

    </NavLink>

    <a
      href="https://github.com"
      target="_blank"
      rel="noreferrer"
      className="
        casio-btn
        h-28
        flex
        flex-col
        items-center
        justify-center
        gap-2
      "
    >
      <div
        className="
          w-3
          h-3
          rounded-full
          bg-[#05df72]
          shadow-[0_0_10px_#05df72]
        "
      />

      <span className="tracking-[0.25em]">
        GITHUB
      </span>

      <span className="text-[10px] opacity-70">
        REPOSITORIES
      </span>

    </a>

  </div>

</div>

            {/* TECH STACK */}

            <div className="border-b border-[#5d6e5d] p-4">

              <h2 className="tracking-[0.25em] text-sm mb-4">
                TECH STACK STATUS
              </h2>

              <div className="space-y-3">

                {[
                  ["React", 95],
                  ["Node", 90],
                  ["MongoDB", 85],
                  ["Express", 85],
                ].map(([skill, value]) => (

                  <div
                    key={skill}
                    className="
                      grid
                      grid-cols-[100px_1fr]
                      gap-3
                      items-center
                    "
                  >

                    <span>{skill}</span>

                    <div
                      className="
                        h-5
                        border
                        border-[#5d6e5d]
                        overflow-hidden
                      "
                    >

                      <div
                        className="h-full bg-[#95b67f]"
                        style={{
                          width: `${value}%`,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* ACTIVE MODULES */}

            <div className="p-4">

              <h2 className="tracking-[0.25em] text-sm mb-4">
                ACTIVE MODULES
              </h2>

              <div className="space-y-2">

                <div>● Portfolio CMS</div>

                <div>● Authentication System</div>

                <div>● Resume Manager</div>

                <div>● Project Dashboard</div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;