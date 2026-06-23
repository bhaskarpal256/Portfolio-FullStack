import { CasioSelect } from "./ui/CasioSelect";
import { Controller } from "react-hook-form";

const ExperienceItem = ({
  index,
  control,
  register,
  removeExp,
  useFieldArray,
}) => {
  const {
    fields: respFields,
    append: appendResp,
    remove: removeResp,
  } = useFieldArray({
    control,
    name: `experience.${index}.responsibilities`,
  });

  return (
   <div className="lcd-screen mb-6 p-5 rounded-lg border-2 border-[#5d6e5d] overflow-visible">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-3xl tracking-wider">EXPERIENCE {index + 1}</h3>

        <button
          type="button"
          className="casio-delete-btn"
          onClick={() => removeExp(index)}
        >
          ×
        </button>
      </div>

      {/* MAIN INFO */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible items-start">
        <input
          className="casio-input"
          placeholder="Company Name"
          {...register(`experience.${index}.company`)}
        />

        <input
          className="casio-input"
          placeholder="Role"
          {...register(`experience.${index}.role`)}
        />

<div className="relative w-full h-[52px] z-50">
  <Controller
    control={control}
    name={`experience.${index}.type`}
    render={({ field }) => (
      <CasioSelect
        options={[
          "internship",
          "full-time",
          "part-time",
          "freelance",
          "other",
        ]}
        value={field.value}
        onChange={field.onChange}
        placeholder="Select Type"
      />
    )}
  />
</div>

        <input
          className="casio-input"
          placeholder="Location"
          {...register(`experience.${index}.location`)}
        />

        <input
          className="casio-input"
          type="date"
          {...register(`experience.${index}.startDate`)}
        />

        <input
          className="casio-input"
          type="date"
          {...register(`experience.${index}.endDate`)}
        />
      </div>

      {/* RESPONSIBILITIES */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl tracking-widest">RESPONSIBILITIES</h4>

        </div>

        <div className="space-y-3">
          {respFields.map((resp, resIndex) => (
            <div key={resp.id} className="flex items-center gap-3">
              <textarea rows={1} className="casio-input flex-1 resize-none overflow-hidden" placeholder={`Responsibility ${resIndex + 1}`}
                {...register(
                  `experience.${index}.responsibilities.${resIndex}`,
                )}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />

              <button
                type="button"
                className="casio-delete-btn shrink-0"
                onClick={() => removeResp(resIndex)}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="casio-lcd-btn cursor-pointer"
            onClick={() => appendResp("")}
          >
            + ADD RESPONSIBILITY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceItem;
