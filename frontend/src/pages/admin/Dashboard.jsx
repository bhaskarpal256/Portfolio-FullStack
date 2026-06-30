import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../../services/project.service.js";
import LoadingScreen from "../../components/ui/LoadingScreen.jsx";

const SectionTitle = ({ children }) => (
  <p className="text-xs tracking-[0.2em] opacity-70 mb-4">{children}</p>
);

const StatCard = ({ label, value }) => (
  <div className="lcd-screen h-32 flex flex-col justify-between">
    <p className="text-xs tracking-[0.2em] opacity-70">{label}</p>

    <div className="casio-display text-5xl">{value}</div>
  </div>
);

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const start = Date.now();
      try {
        const { data } = await getProjects();
        setProjects(data.data || []);
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

  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    frontendProjects: 0,
    backendProjects: 0,
    fullstackProjects: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await getProjects();

        console.log(data);

        const projects = data?.projects || [];

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p) => p.isFeatured).length,
          frontendProjects: projects.filter((p) => p.category === "frontend")
            .length,
          backendProjects: projects.filter((p) => p.category === "backend")
            .length,
          fullstackProjects: projects.filter((p) => p.category === "fullstack")
            .length,
        });

        setRecentProjects(projects.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  const analytics = useMemo(() => {
    const totalProjects = projects.length;

    const featuredProjects = projects.filter((project) => project.isFeatured);

    const projectsMissingImage = projects.filter(
      (project) => !project.imageUrl,
    );

    const projectsMissingGithub = projects.filter(
      (project) => !project.githubLink?.trim(),
    );

    const projectsMissingLive = projects.filter(
      (project) => !project.liveLink?.trim(),
    );

    const projectsMissingCategory = projects.filter(
      (project) => !project.category?.trim(),
    );

    const projectsMissingTech = projects.filter(
      (project) => !project.techStack?.length,
    );

    const techCount = {};

    projects.forEach((project) => {
      project.techStack?.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });

    const mostUsedTech = Object.entries(techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const totalPossibleFields = totalProjects * 5;

    let completedFields = 0;

    projects.forEach((project) => {
      if (project.imageUrl) completedFields++;
      if (project.githubLink) completedFields++;
      if (project.liveLink) completedFields++;
      if (project.category) completedFields++;
      if (project.techStack?.length) completedFields++;
    });

    const completionPercentage =
      totalPossibleFields === 0
        ? 0
        : Math.round((completedFields / totalPossibleFields) * 100);

    const healthScore = Math.max(
      0,
      100 -
        projectsMissingImage.length * 5 -
        projectsMissingGithub.length * 3 -
        projectsMissingLive.length * 3 -
        projectsMissingCategory.length * 2 -
        projectsMissingTech.length * 2,
    );

    const recommendations = [];

    if (projectsMissingLive.length)
      recommendations.push(
        `${projectsMissingLive.length} projects are missing live links`,
      );

    if (projectsMissingGithub.length)
      recommendations.push(
        `${projectsMissingGithub.length} projects are missing GitHub links`,
      );

    if (projectsMissingImage.length)
      recommendations.push(
        `${projectsMissingImage.length} projects are missing images`,
      );

    if (featuredProjects.length < 3)
      recommendations.push("Consider featuring more projects");

    return {
      totalProjects,
      featuredProjects,
      projectsMissingImage,
      projectsMissingGithub,
      projectsMissingLive,
      projectsMissingCategory,
      projectsMissingTech,
      mostUsedTech,
      completionPercentage,
      healthScore,
      recommendations,
      totalTechnologies: Object.keys(techCount).length,
    };
  }, [projects]);

  const totalProjects = projects.length;

  const featuredProjects = projects.filter((project) => project.isFeatured);

  const frontendCount = projects.filter(
    (project) => project.category === "frontend",
  ).length;

  const backendCount = projects.filter(
    (project) => project.category === "backend",
  ).length;

  const fullstackCount = projects.filter(
    (project) => project.category === "fullstack",
  ).length;

  const techFrequency = {};

  projects.forEach((project) => {
    project.techStack?.forEach((tech) => {
      techFrequency[tech] = (techFrequency[tech] || 0) + 1;
    });
  });

  const sortedTech = Object.entries(techFrequency).sort((a, b) => b[1] - a[1]);

  const mostUsedTech = sortedTech[0]?.[0] || "N/A";

  let completedFields = 0;
  let totalFields = 0;

  projects.forEach((project) => {
    totalFields += 6;

    if (project.title) completedFields++;
    if (project.description) completedFields++;
    if (project.imageUrl?.url) completedFields++;
    if (project.githubLink) completedFields++;
    if (project.liveLink) completedFields++;
    if (project.techStack?.length) completedFields++;
  });

  const completionPercentage =
    totalFields === 0 ? 0 : Math.round((completedFields / totalFields) * 100);

  if (loading)
    return <LoadingScreen title="DASHBOARD" subtitle="LOADING DASHBOARD..." />;

  return (
    <div className="space-y-6 p-4">
      {/* TOP STATS */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="TOTAL" value={totalProjects} />
        <StatCard label="FEATURED" value={featuredProjects.length} />
        <StatCard label="FRONTEND" value={frontendCount} />
        <StatCard label="BACKEND" value={backendCount} />
        <StatCard label="FULLSTACK" value={fullstackCount} />
      </div>

      {/* HEALTH + COMPLETION */}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="lcd-screen">
          <SectionTitle>PORTFOLIO HEALTH</SectionTitle>

          <div className="casio-display text-6xl">{analytics.healthScore}%</div>
        </div>

        <div className="lcd-screen">
          <SectionTitle>COMPLETION</SectionTitle>

          <div className="w-full h-4 border border-[#5d6e5d] overflow-hidden">
            <div
              className="h-full bg-[#5d6e5d]"
              style={{
                width: `${analytics.completionPercentage}%`,
              }}
            />
          </div>

          <div className="casio-display text-4xl mt-4">
            {analytics.completionPercentage}%
          </div>
        </div>
      </div>

      {/* SYSTEM STATUS */}

      <div className="lcd-screen">
        <SectionTitle>SYSTEM STATUS</SectionTitle>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="PROJECTS" value={analytics.totalProjects} />

          <StatCard
            label="FEATURED"
            value={analytics.featuredProjects.length}
          />

          <StatCard label="TECHS" value={analytics.totalTechnologies} />

          <StatCard label="HEALTH" value={`${analytics.healthScore}%`} />
        </div>

        <div className="mt-4 opacity-70">STATUS : NOMINAL</div>
      </div>

      {/* MOST USED TECH */}

      <div className="lcd-screen">
        <SectionTitle>MOST USED TECHNOLOGIES</SectionTitle>

        <div className="grid md:grid-cols-5 gap-4">
          {analytics.mostUsedTech.map(([tech, count]) => (
            <div
              key={tech}
              className="
              border
              border-[#5d6e5d]
              rounded
              p-4
            "
            >
              <p className="opacity-70 text-xs">TECHNOLOGY</p>

              <div className="casio-display text-3xl mt-2">{count}</div>

              <div className="mt-2">{tech}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED PROJECTS */}

      <div className="lcd-screen">
        <SectionTitle>FEATURED PROJECTS</SectionTitle>

        <div className="grid md:grid-cols-3 gap-4">
          {analytics.featuredProjects.map((project) => (
            <div
              key={project._id}
              className="
              border
              border-[#5d6e5d]
              rounded
              p-4
            "
            >
              <div className="casio-display text-xl">{project.title}</div>

              <div className="mt-4 flex gap-2">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="casio-lcd-btn"
                  >
                    LIVE
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="casio-lcd-btn"
                  >
                    CODE
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEEDS ATTENTION */}

      <div className="lcd-screen">
        <SectionTitle>PROJECTS NEEDING ATTENTION</SectionTitle>

        <div className="space-y-2">
          {projects
            .filter(
              (project) =>
                !project.githubLink || !project.liveLink || !project.imageUrl,
            )
            .map((project) => (
              <div
                key={project._id}
                className="
                border
                border-[#5d6e5d]
                rounded
                p-4
              "
              >
                <div className="casio-display text-xl">{project.title}</div>

                <div className="opacity-70 mt-2">
                  {!project.imageUrl && "Missing Image • "}
                  {!project.githubLink && "Missing GitHub • "}
                  {!project.liveLink && "Missing Live Link"}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
