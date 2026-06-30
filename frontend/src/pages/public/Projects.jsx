import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getProjects } from "../../services/project.service.js";
import ProjectDetails from "./ProjectDetails.jsx";
import LoadingScreen from "../../components/ui/LoadingScreen.jsx";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const start = Date.now();
      try {
        const response = await getProjects();

        setProjects(response?.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        const elapsed = Date.now() - start;

        const remaining = Math.max(400 - elapsed, 0);

        await new Promise((resolve) => setTimeout(resolve, remaining));

        setLoading(false);
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
      healthScore,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.techStack?.some((tech) =>
          tech.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesFeatured = !featuredOnly || project.isFeatured;

      return matchesSearch && matchesFeatured;
    });
  }, [projects, search, featuredOnly]);

  if (loading) {
    return <LoadingScreen title="PROJECTS" subtitle="LOADING PROJECTS..." />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Glow */}

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
        <div className="casio-panel p-2 md:p-4">
          <div className="lcd-screen lcd-breathe">
            {/* HEADER */}

            <div className="border-b border-[#5d6e5d]">
              <p className="text-[0.625rem] tracking-[0.35em] opacity-70">
                PROJECT DATABASE
              </p>

              <h1
                className="
                  casio-display
                  text-[clamp(2rem,4vw,2.5rem)]
                  tracking-[0.10em]
                "
              >
                PROJECT RECORDS
              </h1>
            </div>

            {/* ANALYTICS */}

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              <div className="border border-[#5d6e5d] rounded py-2 px-4">
                <p className="text-xs opacity-70">PROJECTS</p>

                <p className="casio-display text-3xl">
                  {analytics.totalProjects}
                </p>
              </div>

              <div className="border border-[#5d6e5d] rounded py-2 px-4">
                <p className="text-xs opacity-70">FEATURED</p>

                <p className="casio-display text-3xl">
                  {analytics.featuredProjects}
                </p>
              </div>

              <div className="border border-[#5d6e5d] rounded py-2 px-4">
                <p className="text-xs opacity-70">TECHS</p>

                <p className="casio-display text-3xl">
                  {analytics.totalTechnologies}
                </p>
              </div>

              <div className="border border-[#5d6e5d] rounded py-2 px-4">
                <p className="text-xs opacity-70">HEALTH</p>

                <p className="casio-display text-3xl">
                  {analytics.healthScore}%
                </p>
              </div>
            </div>

            {/* SEARCH */}

            <div className="border border-[#5d6e5d] rounded p-4 mt-4">
              <p className="tracking-[0.2em] text-sm opacity-70 mb-2">
                SEARCH RECORDS
              </p>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="casio-input flex-1"
                />

                <button
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  className={`
                    casio-btn
                    px-4
                    py-2
                    text-xs
                    tracking-[0.2em]
                    ${featuredOnly ? "brightness-110" : ""}
                  `}
                >
                  FEATURED
                </button>
              </div>
            </div>

            {/* PROJECT GRID */}

            <div className="mt-4">
              <p className="tracking-[0.2em] text-sm opacity-70 mb-4">
                DATABASE RECORDS
              </p>

              {loading ? (
                <div className="border border-[#5d6e5d] rounded p-6">
                  LOADING DATABASE...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="border border-[#5d6e5d] rounded p-6">
                  NO RECORDS FOUND
                </div>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-4
                  "
                >
                  {filteredProjects.map((project) => (
                    <div
                      key={project._id}
                      className="
                          border
                          border-[#5d6e5d]
                          rounded
                          overflow-hidden
                          flex
                          flex-col
                        "
                    >
                      {/* IMAGE */}

                      <div className="aspect-video overflow-hidden border-b border-[#5d6e5d]">
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

                      {/* CONTENT */}

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <h2 className="casio-display text-xl">
                            {project.title}
                          </h2>

                          <div
                            className={`
                                w-3
                                h-3
                                rounded-full
                                ${
                                  project.isFeatured
                                    ? "bg-[#b5ff8a] shadow-[0_0_10px_#05df72]"
                                    : "bg-[#4a5a45]"
                                }
                              `}
                          />
                        </div>

                        <p className="text-xs opacity-70 mt-1">
                          {project.category}
                        </p>

                        <p className="text-sm mt-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className="
                                    border
                                    border-[#5d6e5d]
                                    px-2
                                    py-1
                                    text-xs
                                  "
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-5">
                          <Link
                            to={`/projects/${project._id}`}
                            className="
                                casio-btn
                                inline-flex
                                px-4
                                py-2
                                text-xs
                                tracking-[0.25em]
                              "
                          >
                            VIEW DOSSIER
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
