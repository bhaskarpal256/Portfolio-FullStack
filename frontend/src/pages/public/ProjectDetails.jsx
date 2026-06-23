import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProjectById } from "../../services/project.service.js";

const ProjectDetails = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);

        setProject(response?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="casio-display text-2xl">LOADING DOSSIER...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="casio-display text-2xl">RECORD NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden px-4 md:px-6 ">
      {/* BREATHING GLOW */}

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

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="casio-panel p-4">
          <div className="lcd-screen lcd-breathe">
            {/* HEADER */}

            <div className="border-b border-[#5d6e5d] pb-2">
              <h1
                className="
                   casio-display
                  text-[clamp(2rem,4vw,2.5rem)]
                  tracking-[0.15em]"
              >
                {project.title}
              </h1>

              <div className="flex items-center gap-3 ">
                <div
                  className={`
                    w-3
                    h-3
                    rounded-full
                    ${
                      project.isFeatured
                        ? "bg-[#b5ff8a] shadow-[0_0_12px_#05df72]"
                        : "bg-[#4a5a45]"
                    }
                  `}
                />

                <span className="text-xs tracking-[0.25em] opacity-70">
                  {project.isFeatured ? "FEATURED RECORD" : "STANDARD RECORD"}
                </span>
              </div>
            </div>

            {/* IMAGE */}

            {/* VISUAL REFERENCE + SYSTEM LINKS */}

            <div className="grid lg:grid-cols-[1fr_320px] gap-0 mt-4">
              {/* VISUAL REFERENCE */}

              <div className="border border-[#5d6e5d] overflow-hidden">
                <div className="border-b border-[#5d6e5d] p-2">
                  <p className="tracking-[0.2em] text-sm opacity-70">
                    VISUAL REFERENCE
                  </p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="
          w-full
          aspect-video
          overflow-hidden
          border-2
          border-[#5d6e5d]
          shadow-[inset_0_0_25px_rgba(0,0,0,.4)]
        "
                  >
                    <img
                      src={project.imageUrl?.url}
                      alt={project.title}
                      className="
            w-full
            h-full
            object-cover
          "
                    />
                  </div>
                </div>
              </div>

              {/* SYSTEM LINKS */}

              <div className="border-y border-r border-[#5d6e5d] overflow-hidden">
                <div className="border-b border-[#5d6e5d] p-2 ">
                  <p className="tracking-[0.2em] text-sm opacity-70">
                    SYSTEM LINKS
                  </p>
                </div>

                <div className="flex flex-col gap-2 p-2">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="
            casio-btn
            px-5
            py-3
            text-xs
            tracking-[0.25em]
          "
                    >
                      LIVE SYSTEM
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="
            casio-btn
            px-5
            py-3
            text-xs
            tracking-[0.25em]
          "
                    >
                      SOURCE CODE
                    </a>
                  )}

                  <Link
                    to="/projects"
                    className="
          casio-btn
          px-5
          py-3
          text-xs
          tracking-[0.25em]
        "
                  >
                    BACK
                  </Link>
                </div>
                <div className="border-t border-[#5d6e5d]">
                  <div className="border-b border-[#5d6e5d] p-2">
                    <p className="tracking-[0.2em] text-sm opacity-70">
                      PROJECT STATUS
                    </p>
                  </div>

                  <div className="p-2">
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span>CATEGORY</span>
                        <span>{project.category}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>FEATURED</span>
                        <span>{project.isFeatured ? "YES" : "NO"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>CREATED</span>
                        <span>{new Date(project.createdAt).getFullYear()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>STATUS</span>
                        <span>ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PROJECT DESCRIPTION */}

            <div className="border border-[#5d6e5d] mt-4 overflow-hidden">
              <div className="border-b border-[#5d6e5d] p-2">
                <p className="tracking-[0.2em] text-sm opacity-70">
                  PROJECT DESCRIPTION
                </p>
              </div>

              <div className="p-4">
                <p className="leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>

            {/* TECH STACK */}

            <div className="border border-[#5d6e5d] mt-4 p-4">
              <p className="tracking-[0.2em] text-sm opacity-70 mb-5">
                TECHNICAL PROFICIENCY
              </p>

              <div className="grid gap-4">
                {project.techStack?.map((tech, index) => (
                  <div
                    key={index}
                    className="
                        flex
                        items-center
                        gap-4
                      "
                  >
                    <div className="w-28 shrink-0">{tech}</div>

                    <div
                      className="
                          flex-1
                          border
                          border-[#5d6e5d]
                          h-6
                          relative
                          overflow-hidden
                        "
                    >
                      <div
                        className="
                            absolute
                            inset-y-0
                            left-0
                            bg-[#95b67f]
                          "
                        style={{
                          width: `${70 + ((index * 7) % 25)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
