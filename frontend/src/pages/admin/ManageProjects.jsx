import { useEffect, useState } from "react";
import { getProjects, deleteProject } from "../../services/project.service.js";
import ProjectFormModal from "../../components/ProjectFormModal.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { showError, showLoading, showSuccess } from "../../utils/toast.js";
import ProjectCard from "../../components/ProjectCard.jsx";
import LoadingScreen from "../../components/ui/LoadingScreen.jsx";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // useEffect(() => {
  //   console.log(editingProject)
  // }, [editingProject])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const start = Date.now();
      try {
        const { data } = await getProjects();
        console.log("After await getAllProjects", data.data);
        setProjects(data.data);
        console.log("projects:", projects);
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

  // Delete project
  const handleDelete = async () => {
    let toastId;

    try {
      toastId = showLoading("Deleting project...");

      await deleteProject(selectedProjectId);

      setProjects((prev) =>
        prev.filter((project) => project._id !== selectedProjectId),
      );

      setIsOpen(false);
      setSelectedProjectId(null);

      showSuccess("Project deleted successfully!", toastId);
    } catch (error) {
      console.error(error);

      showError(
        error.response?.data?.message || "Failed to delete project",
        toastId,
      );
    }
  };

  if (loading) {
    return <LoadingScreen title="PROJECTS" subtitle="LOADING PROJECTS..." />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="lcd-screen p-4 inline-block">
          <p className="text-[0.625rem] tracking-[0.25em] opacity-70">
            PROJECT DATABASE
          </p>

          <h2 className="text-3xl tracking-[0.2em]">MANAGE PROJECTS</h2>
        </div>
      </div>

      {/* Create Button */}
      <button
        className="casio-lcd-btn mb-4 lcd-screen lcd-breathe cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        ADD PROJECT
      </button>

      {/* Modal */}
      {showModal && (
        <ProjectFormModal
          onClose={() => setShowModal(false)}
          onProjectCreated={(newProject) => {
            setProjects((prev) => [...prev, newProject]);
            setShowModal(false);
          }}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          initialData={editingProject}
          onClose={() => setEditingProject(null)}
          onProjectEdited={(newProject) => {
            setProjects((prev) =>
              prev.map((p) => (p._id === newProject._id ? newProject : p)),
            );

            setEditingProject(null);
          }}
        />
      )}

      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this project?"
        />
      )}

      {/* Project List */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={(project) => setEditingProject(project)}
            onDelete={(project) => {
              setSelectedProjectId(project._id);
              setIsOpen(true);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
