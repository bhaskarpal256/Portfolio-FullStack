import { createPortal } from "react-dom";
import { useEffect } from "react";
import { createSkill, updateSkill } from "../services/skills.service";
import { useState } from "react";
import { useRef } from "react";
import { showSuccess, showError, showLoading } from "../utils/toast";

const SkillFormModal = ({
  initialData,
  onClose,
  onSkillCreated,
  onSkillEdited,
}) => {
  const MAX_FILE_SIZE = 5242880;
  const [preview, setPreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    category: "",
    icon: null,
  });

  const nameInputRef = useRef();
  const categoryInputRef = useRef();
  const iconInputRef = useRef();

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
      name: initialData.name || "",
      category: initialData.category || "",
      icon: null,
    });
    setErrors({});
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let toastId;
    if (initialData) {
      try {
        setIsEditing(true);
        toastId = showLoading("Updating skill...");
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("category", form.category);
        if (form.icon) {
          formData.append("icon", form.icon);
        }

        const { data } = await updateSkill(initialData._id, formData);

        onSkillEdited(data.data);
        setForm({ name: "", category: "", icon: null });
        showSuccess("Skill Edited!", toastId);
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
        toastId = showLoading("Creating skill...");

        console.log("Creating skill...");
        const formData = new FormData();
        formData.append("name", form.name);
        console.log("name appended...");
        formData.append("category", form.category);
        console.log("category appended...");
        if (form.icon) {
          formData.append("icon", form.icon);
        }
        console.log("icon appended...");

        const { data } = await createSkill(formData);

        console.log("fetchedDataSuccessfully...", data.data);
        onSkillCreated(data.data);
        showSuccess("Skill Created!", toastId);
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
      setErrors((prev) => ({ ...prev, icon: "Only image files are allowed" }));
      iconInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        icon: "File size limit exceeded : 5 MB",
      }));
      iconInputRef.current.value = "";
      return;
    }
    setForm((prev) => ({ ...prev, icon: file }));
    setErrors((prev) => ({ ...prev, icon: "" }));

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
    if (!form) return false;
    let newError = {};
    const refs = {
      name: nameInputRef,
      category: categoryInputRef,
      icon: iconInputRef,
    };
    for (let [key, value] of Object.entries(form || {})) {
      //Icon Validation
      if (!initialData && key === "icon" && !value) {
        newError[key] = `${key.charAt(0).toUpperCase()} is required`;
      }
      //Text Validation (name, category)
      else if (typeof value === "string" && value.trim() === "") {
        newError[key] = `${key.charAt(0).toUpperCase()} is required`;
      }
    }
    const errorKeys = Object.keys(newError);
    setErrors(newError);
    if (errorKeys.length > 0) {
      const newKey = errorKeys[0];
      refs[newKey].current.focus();
      refs[newKey].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    return errorKeys.length === 0;
  };

  const closeModal = () => {
    setForm({ name: "", category: "", icon: null });
    iconInputRef.current.value = "";
    setErrors({});
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setIsCreating(false);
    setIsEditing(false);
    onClose();
  };

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
    if (nameInputRef) {
      nameInputRef.current.focus();
    }
  }, []);

  return createPortal(
    <div
  className="
    fixed inset-0
    bg-black/70
    backdrop-blur-sm
    flex items-center justify-center
    z-50
    p-4
  "
  onClick={closeModal}
>
  <div
    className="
      lcd-screen
      casio-display
      w-full
      max-w-2xl
      p-6
      max-h-[90vh]
      overflow-y-auto
      border-4
      border-[#5d6e5d]
    "
    onClick={(e) => e.stopPropagation()}
  >
    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">
      <h2
        className="
          text-3xl
          tracking-[0.2em]
        "
      >
        {initialData ? "EDIT SKILL" : "CREATE SKILL"}
      </h2>

      <button
        type="button"
        className="casio-delete-btn"
        onClick={closeModal}
      >
        ×
      </button>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* PREVIEW */}
{(preview || initialData?.icon?.url) && (
  <div className="lcd-screen p-4 flex justify-center">
    <img
      src={preview || initialData.icon.url}
      alt="preview"
      className="w-24 h-24 object-contain"
    />
  </div>
)}

      {/* NAME */}
      <div>
        <label className="block mb-2 tracking-wider">
          SKILL NAME
        </label>

        <input
          ref={nameInputRef}
          className="casio-input w-full"
          placeholder="React"
          type="text"
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });

            setErrors((prev) => ({
              ...prev,
              name: "",
            }));
          }}
        />

        {errors.name && (
          <span className="block mt-1 text-[#9f2f2f]">
            {errors.name}
          </span>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block mb-2 tracking-wider">
          CATEGORY
        </label>

        <select
          ref={categoryInputRef}
          className="casio-input w-full cursor-pointer"
          value={form.category}
          onChange={(e) => {
            setForm({
              ...form,
              category: e.target.value,
            });

            setErrors((prev) => ({
              ...prev,
              category: "",
            }));
          }}
        >
          <option className=" cursor-pointer" value="">
            Select Category
          </option>

          <option className=" cursor-pointer" value="frontend">
            Frontend
          </option>

          <option className=" cursor-pointer" value="backend">
            Backend
          </option>

          <option className=" cursor-pointer" value="database">
            Database
          </option>

          <option className=" cursor-pointer" value="devops">
            DevOps
          </option>

          <option className=" cursor-pointer" value="tools">
            Tools
          </option>

          <option className=" cursor-pointer" value="other">
            Other
          </option>
        </select>

        {errors.category && (
          <span className="block mt-1 text-[#9f2f2f]">
            {errors.category}
          </span>
        )}
      </div>

      {/* DROP ZONE */}
      <div>
        <label className="block mb-2 tracking-wider">
          ICON
        </label>

        <div
          className="
            lcd-screen
            text-center
            p-8
            cursor-pointer
            hover:shadow-[0_0_15px_rgba(170,255,120,.5)]
            transition-all
          "
          onDragOver={(e) =>
            e.preventDefault()
          }
          onDrop={handleDrop}
          onClick={() =>
            iconInputRef.current?.click()
          }
        >
          <p className="text-lg tracking-wider">
            DROP IMAGE
          </p>

          <p className="text-sm opacity-70 mt-1">
            OR CLICK TO UPLOAD
          </p>

          <input
            type="file"
            ref={iconInputRef}
            onChange={handleFileSubmit}
            accept="image/*"
            className="hidden"
          />
        </div>

        {errors.icon && (
          <span className="block mt-1 text-[#9f2f2f]">
            {errors.icon}
          </span>
        )}
      </div>

      {/* BUTTONS */}
      <div
        className="
          flex
          justify-end
          gap-3
          pt-4
        "
      >
        <button
  type="button"
  className="casio-cancel-btn"
  onClick={closeModal}
>
  CANCEL
</button>

        <button
          type="submit"
          disabled={
            isCreating || isEditing
          }
          className="casio-lcd-btn"
        >
          {initialData
            ? isEditing
              ? "SAVING..."
              : "SAVE"
            : isCreating
              ? "CREATING..."
              : "CREATE"}
        </button>
      </div>
    </form>
  </div>
</div>,
    document.body,
  );
};

export default SkillFormModal;
