const EducationItem = ({
  index,
  register,
  removeEdu,
}) => {
  return (
    <div className="lcd-screen mb-6 p-5 rounded-lg border-2 border-[#5d6e5d]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-3xl tracking-wider">
          EDUCATION {index + 1}
        </h3>

        <button
          type="button"
          className="casio-delete-btn"
          onClick={() => removeEdu(index)}
        >
          ×
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="casio-input"
          type="text"
          placeholder="Institution Name"
          {...register(
            `education.${index}.institution`
          )}
        />

        <input
          className="casio-input"
          type="text"
          placeholder="Degree"
          {...register(
            `education.${index}.degree`
          )}
        />

        <input
          className="casio-input"
          type="text"
          placeholder="Field Of Study"
          {...register(
            `education.${index}.fieldOfStudy`
          )}
        />

        <input
          className="casio-input"
          type="text"
          placeholder="Grade / CGPA"
          {...register(
            `education.${index}.grade`
          )}
        />

        <input
          className="casio-input"
          type="number"
          min="1950"
          max="2050"
          placeholder="Start Year"
          {...register(
            `education.${index}.startYear`
          )}
        />

        <input
          className="casio-input"
          type="number"
          min="1950"
          max="2050"
          placeholder="End Year"
          {...register(
            `education.${index}.endYear`
          )}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mt-6">
        <h4 className="text-xl tracking-widest mb-3">
          DESCRIPTION
        </h4>

        <textarea
          rows={1}
          className="
            casio-input
            resize-none
            overflow-hidden
            w-full
          "
          placeholder="Describe coursework, achievements, activities..."
          {...register(
            `education.${index}.description`
          )}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height =
              `${e.target.scrollHeight}px`;
          }}
        />
      </div>

    </div>
  );
};

export default EducationItem;