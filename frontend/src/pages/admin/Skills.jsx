import { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  getSkills,
  deleteSkill,
  updateSkill,
} from "../../services/skills.service.js";
import SkillFormModal from "../../components/SkillFormModal.jsx";
import { showError, showLoading, showSuccess } from "../../utils/toast.js";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import SkillCard from "../../components/SkillCard.jsx";
import { Controller } from "react-hook-form";
import { CasioSelect } from "../../components/ui/CasioSelect.jsx";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkillFormModal, setShowSkillFormModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        console.log("Calling API...");
        const { data } = await getSkills();
        console.log("API response:", data);
        setSkills(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    //React runs your effect
    const timeOut = setTimeout(() => setDebouncedSearch(search), 300);
    // React STORES the returned function (cleanup).It keeps it internally like:
    // "Okay, next time before I run this effect again,
    // I should call this cleanup function first"
    return () => clearTimeout(timeOut);
  }, [search]);

  const handleDelete = async () => {
    let previousSkills;
    let toastId;

    try {
      toastId = showLoading("Deleting skill...");

      setSkills((prev) => {
        previousSkills = prev;
        return prev.filter((skill) => skill._id !== selectedSkillId);
      });

      await deleteSkill(selectedSkillId);

      setIsOpen(false);
      setSelectedSkillId(null);

      showSuccess("Skill deleted successfully!", toastId);
    } catch (error) {
      if (previousSkills) {
        setSkills(previousSkills);
      }

      showError(
        error.response?.data?.message || "Failed to delete skill",
        toastId 
      );
    }
  };

  const toggleFeatured = async (skill) => {
    try {
      const updatedSkill = {
        isFeatured: !skill.isFeatured,
      };

      console.log(updatedSkill);

      const { data } = await updateSkill(skill._id, updatedSkill);

      setSkills((prev) =>
        prev.map((s) => (s._id === skill._id ? data.data : s)),
      );
    } catch (error) {
      console.log("FULL ERROR:", error); // ✅ VERY IMPORTANT
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);

      console.error(error);
    }
  };

  const filteredSkills = useMemo(
    () =>
      //useMemo is used so that filteredSkills does not run on every render even if the function or its values are not its dependencies i.e,modal open/close/toast/typing/anything and to only run when dependencies change.
      skills.filter((skill) => {
        const matchesFilter =
          filter === "featured"
            ? skill.isFeatured
            : filter === "not-featured"
              ? !skill.isFeatured
              : true;

        const matchesSearch =
          debouncedSearch === "" ||
          skill.name.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesCategory =
          category === "" ||
          skill.category.toLowerCase().includes(category.toLowerCase());

        return matchesFilter && matchesSearch && matchesCategory;
      }),
    [skills, filter, debouncedSearch, category],
  );

  return (
  <>
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="lcd-screen">
        <h2 className="text-5xl casio-display leading-none">
          SKILL DATABASE
        </h2>

        <p className="text-xs tracking-[0.25em] mt-2">
          SYSTEM RECORDS
        </p>
      </div>

      {/* LOADING / EMPTY */}
      {loading && (
        <div className="lcd-screen">
          <p>LOADING SKILLS...</p>
        </div>
      )}

      {!loading && !skills.length && (
        <div className="lcd-screen">
          <p>NO SKILLS FOUND</p>
        </div>
      )}

      {/* SEARCH */}
      <div className="lcd-screen">
        <h3 className="text-2xl tracking-wider mb-4">
          SEARCH
        </h3>

        <input
          className="casio-input w-full"
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="lcd-screen">
        <h3 className="text-2xl tracking-wider mb-4">
          FILTERS
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <CasioSelect
  value={category}
  onChange={setCategory}
  placeholder="All Categories"
  options={[
    "frontend",
    "backend",
    "database",
    "devOps",
    "tools",
    "other",
  ]}
/>

          <CasioSelect
  value={filter}
  onChange={setFilter}
  placeholder="Filter Skills"
  options={[
    "all",
    "featured",
    "not-featured",
  ]}
/>
        </div>
      </div>

      {/* SKILLS */}
      <div className="lcd-screen">
        <h3 className="text-2xl tracking-wider mb-5">
          SKILL RECORDS
        </h3>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onToggle={toggleFeatured}
              onEdit={(skill) => setEditingSkill(skill)}
              onDelete={(skill) => {
                setSelectedSkillId(skill._id);
                setIsOpen(true);
              }}
            />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#5d6e5d]">
          <button
            className="casio-lcd-btn"
            onClick={() => setShowSkillFormModal(true)}
          >
            + ADD SKILL
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showSkillFormModal && (
        <SkillFormModal
          onClose={() => setShowSkillFormModal(false)}
          onSkillCreated={(newSkill) =>
            setSkills((prev) => [...prev, newSkill])
          }
        />
      )}

      {editingSkill && (
        <SkillFormModal
          initialData={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSkillEdited={(editedSkill) =>
            setSkills((prev) =>
              prev.map((s) =>
                s._id === editedSkill._id ? editedSkill : s
              )
            )
          }
        />
      )}

      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this skill?"
        />
      )}
    </div>
  </>
);
};

export default Skills;
