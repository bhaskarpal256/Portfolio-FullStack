import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { showSuccess, showError, showLoading } from "../utils/toast.js";
import {
  createProject,
  updateProjectdetails,
  updateProjectImage,
} from "../services/project.service.js";
import { CasioSelect } from "./ui/CasioSelect.jsx";

const ProjectFormModal = ({
  initialData,
  onClose,
  onProjectCreated,
  onProjectEdited,
}) => {
  const MAX_FILE_SIZE = 5242880;
  const [preview, setPreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: [],
    imageUrl: null,
    githubLink: "",
    liveLink: "",
    isFeatured: false,
    category: "",
  });

  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const imageInputRef = useRef();
  const techStackInputRef = useRef();
  const githubInputRef = useRef();
  const liveLinkInputRef = useRef();

  const [techInput, setTechInput] = useState("");

  const handleTechStack = () => {
    if (!techInput.trim()) return;

    const tech = techInput.trim();

    if (form.techStack.includes(tech)) return;

    setForm((prev) => ({
      ...prev,
      techStack: [...prev.techStack, techInput.trim()],
    }));
    setTechInput("");
  };

  const deleteTechStack = (index) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    //return inside useEffect is different
    // The return does not return a value to you. Instead, React interprets it as: "This is the cleanup function". React stores it and runs it later.
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //Browser stores object URLs in memory so remove it

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (!initialData) return;
    setForm({
      title: initialData.title || "",
      description: initialData.description || "",
      techStack: initialData.techStack || [],
      githubLink: initialData.githubLink || "",
      liveLink: initialData.liveLink || "",
      isFeatured: initialData.isFeatured ?? false,
      category: initialData.category || "",
      imageUrl: null,
    });
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (titleInputRef) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let toastId;
    if (initialData) {
      try {
        setIsEditing(true);
        toastId = showLoading("Updating project...");

        let updatedProject = {};

        if (form.imageUrl) {
          const imageData = new FormData();
          imageData.append("projectImage", form.imageUrl);
          const imageResponse = await updateProjectImage(
            initialData._id,
            imageData,
          );
          updatedProject = {
            ...updatedProject,
            imageUrl: imageResponse?.data?.data?.image,
          };
        }

        const { imageUrl, ...filteredForm } = form;
        const { data } = await updateProjectdetails(
          initialData._id,
          filteredForm,
        );
        const response = data?.data || {};

        updatedProject = { ...updatedProject, ...response };

        onProjectEdited(updatedProject);
        setForm({
          title: "",
          description: "",
          techStack: [],
          isFeatured: false,
          githubLink: "",
          liveLink: "",
          category: "",
          imageUrl: null,
        });
        showSuccess("Project Edited!", toastId);
        closeModal();
      } catch (error) {
        showError(
          error.response?.data?.message || "Something went wrong!",
          toastId,
        );
      } finally {
        setIsEditing(false);
      }
    } else {
      try {
        setIsCreating(true);
        toastId = showLoading("Creating project...");

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("techStack", form.techStack);
        formData.append("githubLink", form.githubLink);
        formData.append("liveLink", form.liveLink);
        formData.append("category", form.category);
        if (form.imageUrl) {
          formData.append("projectImage", form.imageUrl);
        }
        const { data } = await createProject(formData);

        onProjectCreated(data.data);
        showSuccess("Project Created!", toastId);
        closeModal();
      } catch (error) {
        showError(error, toastId);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Only image files are allowed",
      }));
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "File size limit exceeded : 5 MB",
      }));
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      return;
    }
    setForm((prev) => ({ ...prev, imageUrl: file }));
    setErrors((prev) => ({ ...prev, imageUrl: "" }));

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const validateForm = () => {
    let newErrors = {};
    const refs = {
      title: titleInputRef,
      description: descriptionInputRef,
      imageUrl: imageInputRef,
      githubLink: githubInputRef,
      liveLink: liveLinkInputRef,
    };
    for (let [key, value] of Object.entries(form)) {
      if (["githubLink", "liveLink", "isFeatured"].includes(key)) continue;

      //Image validation
      if (key === "imageUrl") {
        if (!initialData && !value) {
          newErrors[key] = "Image is required";
        }
        continue;
      }

      //TechStack array validation
      if (
        key === "techStack" &&
        (!Array.isArray(value) || value.length === 0)
      ) {
        newErrors[key] = "Add at least one tech";
      }

      //Text Validation (name, category)
      if (typeof value === "string" && value.trim() === "") {
        newErrors[key] = `${key.charAt(0).toUpperCase()} is required`;
      }
    }

    const errorKeys = Object.keys(newErrors);
    setErrors(newErrors);
    if (errorKeys.length > 0) {
      const newKey = errorKeys[0]; //for ex- title has an error

      if (newKey === "imageUrl") {
        imageInputRef.current?.click();
        imageInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (refs[newKey]?.current) {
        refs[newKey].current.focus();
        refs[newKey].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
    return errorKeys.length === 0;
  };

  const closeModal = () => {
    setForm({
      title: "",
      description: "",
      techStack: [],
      githubLink: "",
      liveLink: "",
      isFeatured: false,
      category: "",
      imageUrl: null,
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setErrors({});
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setIsCreating(false);
    setIsEditing(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="lcd-screen
    lcd-breathe
    w-full
    max-w-2xl
    max-h-[90vh]
    overflow-hidden
    flex
    flex-col
"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <p className="text-[0.625rem] tracking-[0.25em] opacity-70">
            PROJECT DATABASE
          </p>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl tracking-[0.2em]">
              {initialData ? "EDIT PROJECT" : "CREATE PROJECT"}
            </h2>

            <button
              type="button"
              className="casio-delete-btn"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto pr-1 space-y-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_14rem] gap-4">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-2">
              <input
                className="casio-input w-full"
                name="title"
                placeholder="Project Title"
                type="text"
                ref={titleInputRef}
                value={form.title}
                onChange={handleChange}
              />

              <textarea
                rows={4}
                className="casio-input resize-none w-full flex-1"
                name="description"
                placeholder="Project Description"
                ref={descriptionInputRef}
                value={form.description}
                onChange={handleChange}
              />

              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div
              className="
      lcd-screen
    relative
    group
    cursor-pointer
    flex
    items-center
    justify-center
    overflow-hidden
    "
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => imageInputRef.current?.click()}
            >
              <div
                className="
     absolute inset-0
    bg-black/40
    opacity-0
    group-hover:opacity-100
    transition-opacity
duration-200
    ease-out
    rounded-[0.25rem]

    flex items-center justify-center
  "
              >
                <span className="text-white text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="
      w-10 h-10
      text-[#d7ffd7]
      drop-shadow-[0_0_0.375rem_rgba(170,255,120,.5)]
    "
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 16V4" />
                    <path d="M7 9L12 4L17 9" />
                    <path d="M5 20H19" />
                  </svg>
                </span>
              </div>
              {preview || initialData?.imageUrl?.url ? (
                <img
                  src={preview || initialData?.imageUrl?.url}
                  alt="preview"
                  className=" w-auto
  h-auto
  max-w-full
  max-h-full
  object-contain"
                />
              ) : (
                <div className="text-center">
                  <p className="tracking-[0.2em]">PROJECT IMAGE</p>
                  <p className="opacity-60 text-xs mt-2">DROP IMAGE OR CLICK</p>
                </div>
              )}

              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleFileSubmit}
                className="hidden"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          {errors.imageUrl && (
            <span className="text-red-500">{errors.imageUrl}</span>
          )}

          {/* TechInput Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                name="TechInput"
                className="casio-input w-full"
                type="text"
                placeholder="Add Tech (e.g. React)"
                ref={techStackInputRef}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTechStack();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleTechStack}
                className="casio-lcd-btn w-12 h-12 text-4xl leading-none flex items-center justify-center shrink-0 cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {form.techStack.map((tech, index) => (
                <div
                  key={`${tech}-${index}`}
                  className="px-3 py-1 border border-[var(--lcd-border)] rounded flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    className="opacity-60
  hover:opacity-100
  cursor-pointer
  w-4
  h-4
  flex
  items-center
  justify-center"
                    onClick={() => deleteTechStack(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {errors.techStack && (
            <span className="text-red-500">{errors.techStack}</span>
          )}

          {/* githubLink Section */}
          <input
            name="githubLink"
            className="casio-input w-full"
            type="text"
            placeholder="GitHub URL"
            ref={githubInputRef}
            value={form.githubLink}
            onChange={handleChange}
          />
          {errors.githubLink && (
            <span className="text-red-500">{errors.githubLink}</span>
          )}

          {/* liveLink Section */}
          <input
            name="liveLink"
            className="casio-input w-full"
            type="text"
            placeholder="Live Demo URL"
            ref={liveLinkInputRef}
            value={form.liveLink}
            onChange={handleChange}
          />
          {errors.liveLink && (
            <span className="text-red-500">{errors.liveLink}</span>
          )}

          {/* Category */}
          <CasioSelect
            value={form.category}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                category: value,
              }))
            }
            placeholder="Select Category"
            options={[
              "frontend",
              "backend",
              "fullstack",
              "mobile",
              "ai",
              "other",
            ]}
          />
          {errors.category && (
            <span className="text-red-500">{errors.category}</span>
          )}

          {/* isFeatured */}
          <div className="flex flex-col items-center gap-2 mt-4 border-t border-b border-[#5d6e5d] py-4">
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  isFeatured: !prev.isFeatured,
                }))
              }
              className={`
      text-3xl
      cursor-pointer
      transition-all
      duration-200

      ${
        form.isFeatured
          ? "text-[#3b4f26] drop-shadow-[0_0_0.625rem_rgba(120,180,120,.8)]"
          : "opacity-50 hover:opacity-100"
      }
    `}
            >
              {form.isFeatured ? "★" : "☆"}
            </button>

            <span className="text-xs tracking-[0.25em]">FEATURED PROJECT</span>
          </div>
          {errors.isFeatured && (
            <span className="text-red-500">{errors.isFeatured}</span>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={isCreating || isEditing}
              className="casio-lcd-btn flex-1"
            >
              {initialData
                ? isEditing
                  ? "Saving..."
                  : "Save"
                : isCreating
                  ? "Creating..."
                  : "Create"}
            </button>
            <button
              type="button"
              className="casio-cancel-btn flex-1"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default ProjectFormModal;
