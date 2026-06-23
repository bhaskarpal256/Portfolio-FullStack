import { useEffect, useState } from "react";
import { getResume } from "../../services/resume.service.js";

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResume();
        setResume(response?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="lcd-screen p-6">
          LOADING DOSSIER...
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="lcd-screen p-6">
          DOSSIER NOT FOUND
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative ">

      {/* Background Glow */}

      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div
          className="
            w-[40rem]
            h-[40rem]
            rounded-full
            bg-[#aaff78]
            blur-[12rem]
            mx-auto
            mt-20
          "
        />
      </div>

     <div className="max-w-4xl mx-auto casio-panel p-2 md:p-4 relative">

  <div
    className="
      absolute
      -top-10
      left-1/2
      -translate-x-1/2
      w-[28rem]
      h-[28rem]
      rounded-full
      bg-[#aaff78]
      blur-[9rem]
      opacity-15
      pointer-events-none
    "
  />

  <div className="lcd-screen lcd-breathe relative">

          {/* HEADER */}

          <div className="border-b border-[#5d6e5d] px-4 pb-2">

           <p className="tracking-[0.3em] text-[0.625rem] opacity-70 leading-none mb-1">
  CAREER DOSSIER
</p>

          <h1
  className="
    casio-display
    text-[clamp(2rem,4vw,2.5rem)]
    tracking-[0.10em]
    leading-none

  "
>
  BHASKAR PAL
</h1>

            <div className="flex flex-wrap gap-6 mt-1 text-sm">

              <span>FULL STACK DEVELOPER</span>

              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#05df72] shadow-[0_0_10px_#05df72]" />
                AVAILABLE
              </span>

            </div>

          </div>

          {/* PROFILE + SUMMARY */}

          <div className="grid lg:grid-cols-[250px_1fr]">

            {/* LEFT */}

            <div className="border-r border-b border-[#5d6e5d] py-2 px-4">

              <h2 className="tracking-[0.25em] font-bold text-base mb-2">
                PROFILE
              </h2>

              <div
                className="
                  h-52
                  border
                  border-[#5d6e5d]
                  mb-2
                  flex
                  items-center
                  justify-center
                  text-xs
                  opacity-70
                "
              >
                PHOTO
              </div>

              <div className="space-y-3 text-sm">

                <div>
                  <p className="opacity-60">LOCATION</p>
                  <p>India</p>
                </div>

                <div>
                  <p className="opacity-60">EXPERIENCE</p>
                  <p>
                    {resume.experience?.length || 0} Records
                  </p>
                </div>

                <div>
                  <p className="opacity-60">LANGUAGES</p>
                  <p>
                    {resume.languages?.length || 0}
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="border-b border-[#5d6e5d] py-2 px-4">

              <h2 className="tracking-[0.25em] font-bold text-base mb-2">
                SUMMARY
              </h2>

              <p className="leading-relaxed">
                {resume.summary}
              </p>

            </div>

          </div>

          {/* EXPERIENCE */}

          <div className="border-b border-[#5d6e5d] p-4">

            <h2 className="tracking-[0.25em] font-bold text-base mb-4">
              EXPERIENCE LOG
            </h2>

            <div className="space-y-3">

              {resume.experience?.map((item, index) => (
                <div
                  key={index}
                  className="
                    border
                    border-[#5d6e5d]
                    p-3
                  "
                >
                  <div className="font-bold">
                    ► {item.role}
                  </div>

                  <div className="text-sm opacity-70">
                    {item.company}
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* SKILLS */}

          <div className="border-b border-[#5d6e5d] p-4">

            <h2 className="tracking-[0.25em] text-base mb-4 font-bold">
              TECHNICAL PROFICIENCY
            </h2>

            <div className="space-y-4">

              {resume.skills?.map((item, index) => {

                const bars =
                  "█".repeat(item.rating || 7);

                return (
                  <div
                    key={index}
                    className="grid grid-cols-[160px_1fr]"
                  >
                    <div>
                      {item.skill?.name || "Skill"}
                    </div>

                    <div className="casio-display">
                      {bars}
                    </div>
                  </div>
                );
              })}

            </div>

          </div>

          {/* EDUCATION */}

          <div className="border-b border-[#5d6e5d] p-4">

            <h2 className="tracking-[0.25em] font-bold text-base mb-4">
              EDUCATION
            </h2>

            <div className="space-y-3">

              {resume.education?.map((edu, index) => (
                <div
                  key={index}
                  className="
                    border
                    border-[#5d6e5d]
                    p-3
                  "
                >
                  <div className="font-bold">
                    {edu.degree}
                  </div>

                  <div className="opacity-70 text-sm">
                    {edu.institution}
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* CERTIFICATIONS */}

          <div className="border-b border-[#5d6e5d] p-4">

            <h2 className="tracking-[0.25em] font-bold text-base mb-4">
              CERTIFICATIONS
            </h2>

            <div className="space-y-2">

              {resume.certifications?.map(
                (cert, index) => (
                  <div key={index}>
                    ► {cert.title}
                  </div>
                )
              )}

            </div>

          </div>

          {/* FOOTER */}

          <div className="p-4">

            <h2 className="tracking-[0.25em] font-bold text-base mb-4">
              RESUME ARCHIVE
            </h2>

            <a
              href={resume.resumePdf?.url}
              target="_blank"
              rel="noreferrer"
              className="casio-lcd-btn inline-block"
            >
              DOWNLOAD PDF
            </a>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Resume;