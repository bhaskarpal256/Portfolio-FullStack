import { useEffect, useState } from "react";
import {
  getResume,
  updateResume,
  resumePdfUpdate,
} from "../../services/resume.service.js";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { showError, showLoading, showSuccess } from "../../utils/toast.js";
import ExperienceItem from "../../components/ExperienceItem.jsx";
import EducationItem from "../../components/EducationItem.jsx";
import { CasioSelect } from "../../components/ui/CasioSelect.jsx";

const ResumeUpdate = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await getResume();
        const formattedData = {
          ...data.data,
          experience: data.data.experience.map((exp) => ({
            ...exp,
            startDate: exp.startDate?.split("T")[0] || "",
            endDate: exp.endDate?.split("T")[0] || "",
          })),
        };
        reset(formattedData);
        setResume(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [reset]);

  const onSubmit = async (data) => {
    let toastId;
    try {
      toastId = showLoading("Updating resume...");

      if (data.resumePdf?.[0]) {
        try {
          const formData = new FormData();
          formData.append("resumePdf", data.resumePdf[0]);
          await resumePdfUpdate(formData);
          showSuccess("Resume updated successfully!", toastId);
        } catch (error) {
          console.log("FULL ERROR:", error);
          console.log("RESPONSE:", error.response);
          console.log("DATA:", error.response?.data);
          showError("Something went wrong!", toastId);
        }
      }

      const { resumePdf, _id, __v, createdAt, updatedAt, ...rest } = data;
      console.log(rest);

      await updateResume(rest);

      console.log("inside onSubmit");
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);
    }
  };

  if (loading) return <p>Loading resume...</p>;

  return (
    <div className="">
      <div className="p-6 lcd-screen lcd-breathe casio-display">
        <h2 className="text-xl font-bold mb-4">Manage Resume</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 ">
            <div className="lcd-screen mb-6">
              <div className="mb-3 text-3xl tracking-widest">SUMMARY</div>
              <textarea
                className="casio-input w-full min-h-[150px] resize-y"
                {...register("summary", {
                  required: "Summary is required",
                  minLength: 30,
                })}
              />
            </div>

            {/* ADD EXPERIENCE */}
            <div className="flex items-center justify-between mt-8 mb-4">
              <h3 className="text-3xl tracking-widest">EXPERIENCE</h3>

              <div className="text-xs opacity-70">
                MODULE {expFields.length}
              </div>
            </div>
            {expFields.map((field, index) => (
              <ExperienceItem
                key={field.id}
                index={index}
                control={control}
                register={register}
                removeExp={removeExp}
                useFieldArray={useFieldArray}
              />
            ))}
            {console.log(expFields)}

            <button
              type="button"
              className="casio-lcd-btn cursor-pointer"
              onClick={() =>
                appendExp({
                  company: "",
                  role: "",
                  type: "",
                  startDate: "",
                  endDate: "",
                  location: "",
                  responsibilities: [],
                })
              }
            >
              + Add Experience
            </button>

            {/* ADD EDUCATION */}
            <div className="flex items-center justify-between mt-8 mb-4">
              <h3 className="text-3xl tracking-widest">Education</h3>
              <div className="text-xs opacity-70">
                {" "}
                MODULE {eduFields.length}
              </div>
            </div>
            {eduFields.map((field, index) => (
              <EducationItem
                key={field.id}
                index={index}
                register={register}
                removeEdu={removeEdu}
              />
            ))}

            <button
              type="button"
              className="casio-lcd-btn cursor-pointer"
              onClick={() =>
                appendEdu({
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  startYear: "",
                  endYear: "",
                  grade: "",
                  description: "",
                })
              }
            >
              + Add Education
            </button>

            {/* ADD CERTIFICATIONS  */}
           {/* CERTIFICATIONS */}

<div className="mt-8">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-3xl tracking-widest">
      CERTIFICATIONS
    </h3>

  </div>

  <div className="space-y-6">
    {certFields.map((field, index) => (
      <div
        key={field.id}
        className="
          lcd-screen
          p-5
          border-2
          border-[#5d6e5d]
        "
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl tracking-wider">
            CERT {String(index + 1).padStart(2, "0")}
          </h4>

          <button
            type="button"
            className="casio-delete-btn"
            onClick={() => removeCert(index)}
          >
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="casio-input"
            placeholder="Certificate Title"
            {...register(
              `certifications.${index}.title`
            )}
          />

          <input
            className="casio-input"
            placeholder="Issuer"
            {...register(
              `certifications.${index}.issuer`
            )}
          />

          <input
            className="casio-input"
            type="date"
            {...register(
              `certifications.${index}.date`
            )}
          />

          <input
            className="casio-input"
            placeholder="Certificate URL"
            {...register(
              `certifications.${index}.url`
            )}
          />

        </div>
      </div>
    ))}
    <button
      type="button"
      className="casio-lcd-btn cursor-pointer"
      onClick={() =>
        appendCert({
          title: "",
          issuer: "",
          date: "",
          url: "",
        })
      }
    >
      + ADD CERTIFICATION
    </button>
  </div>
</div>

            {errors.summary && <p>{errors.summary.message}</p>}

            <div className="lcd-screen mt-8">
              <h3 className="text-3xl mb-4 tracking-widest">LINKS</h3>

              <div className="grid gap-3">
                <input
                  className="casio-input"
                  placeholder="GitHub"
                  {...register("links.github")}
                />

                <input
                  className="casio-input"
                  placeholder="LinkedIn"
                  {...register("links.linkedin")}
                />

                <input
                  className="casio-input"
                  placeholder="Website"
                  {...register("links.website")}
                />

                <input
                  className="casio-input"
                  placeholder="Twitter"
                  {...register("links.twitter")}
                />

                <input
                  className="casio-input"
                  placeholder="Instagram"
                  {...register("links.instagram")}
                />
              </div>
            </div>

   {/* LANGUAGES + RESUME FILE */}
<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-8 items-start">

  {/* LANGUAGES */}
<div className="lcd-screen p-5">

  <h3 className="text-3xl tracking-widest mb-4">
    LANGUAGES
  </h3>

  <div className="space-y-3">
    {fields.map((field, index) => (
      <div
        key={field.id}
        className="flex items-center gap-3"
      >
        <input
          className="casio-input flex-1"
          placeholder="Language"
          {...register(`languages.${index}.name`)}
        />

   <Controller
  control={control}
  name={`languages.${index}.proficiency`}
  render={({ field }) => (
    <div className="w-40">
      <CasioSelect
        options={[
          "basic",
          "conversational",
          "fluent",
          "native",
        ]}
        value={field.value}
        onChange={field.onChange}
        placeholder="Level"
      />
    </div>
  )}
/>

        <button
          type="button"
          className="casio-delete-btn"
          onClick={() => remove(index)}
        >
          ×
        </button>
      </div>
    ))}
  </div>

  <div className="mt-4 pt-4 border-t border-[#5d6e5d]">
    <button
      className="casio-lcd-btn"
      type="button"
      onClick={() =>
        append({
          name: "",
          proficiency: "",
        })
      }
    >
      + ADD LANGUAGE
    </button>
  </div>

</div>

  {/* RESUME FILE */}
  <div
    className="
      lcd-screen
      flex
      flex-col
      justify-between
      min-h-[280px]
    "
  >
    <div>
      <h3 className="text-3xl tracking-widest mb-4">
        RESUME
      </h3>

      <div className="text-xs opacity-70 mb-4">
        PDF STORAGE MODULE
      </div>

      <input
        type="file"
        accept="application/pdf"
        className="casio-input w-full"
        {...register("resumePdf")}
      />
    </div>

    <div className="space-y-3">
      <a
        href={resume?.resumePdf?.url}
        target="_blank"
        rel="noreferrer"
        className="
          casio-lcd-btn
          w-full
          flex
          justify-center
        "
      >
        DOWNLOAD PDF
      </a>

      <div
        className="
          text-xs
          opacity-70
          border-t
          border-[#5d6e5d]
          pt-3
        "
      >
        FILE STATUS: READY
      </div>
    </div>
  </div>
</div>
          </div>

         <div className="flex justify-end mt-10">
  <button
    type="submit"
    className="lcd-screen-lit px-8 py-4 text-3xl tracking-[0.2em] border-2 border-[#5d6e5d] hover:scale-[1.02] transition-all cursor-pointer"
  >
    {saving
      ? "SAVING..."
      : "SAVE CHANGES"}
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpdate;
