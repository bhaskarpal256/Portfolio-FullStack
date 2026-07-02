import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { sendMessage } from "../../services/message.service.js";
import { getResume } from "../../services/resume.service.js";
import LoadingScreen from "../../components/ui/LoadingScreen.jsx";

const Contact = () => {
  const [sending, setSending] = useState(false);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      const start = Date.now();
      try {
        const { data } = await getResume();
        setResume(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        const elapsed = Date.now() - start;

        const remaining = Math.max(400 - elapsed, 0);

        await new Promise((resolve) => setTimeout(resolve, remaining));

        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      toast.error("NAME IS REQUIRED");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("EMAIL IS REQUIRED");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("INVALID EMAIL ADDRESS");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("MESSAGE IS REQUIRED");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error("MESSAGE MUST BE AT LEAST 10 CHARACTERS");
      return;
    }

    try {
      setSending(true);

      await sendMessage(formData);

      toast.success("TRANSMISSION SUCCESSFUL");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("TRANSMISSION FAILED");
    } finally {
      setSending(false);
    }
  };

    if (loading) {
    return <LoadingScreen title="CONTACT" subtitle="LOADING CONTACT..." />;
  }


  return (
    <div className="min-h-screen relative md:px-6">
      {/* BREATHING GLOW */}

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
            animate-pulse
          "
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="casio-panel p-2 md:p-4">
          <div className="lcd-screen lcd-breathe">
            {/* HEADER */}

            <div className="border-b border-[#5d6e5d] pb-2">
              <p className="text-[0.625rem] tracking-[0.35em] opacity-70">
                COMMUNICATION TERMINAL
              </p>

              <h1
                className="
                 casio-display
                  text-[clamp(2rem,4vw,2.5rem)]
                  tracking-[0.10em]
                "
              >
                CONTACT
              </h1>

              <div className="flex items-center gap-3 ">
                <div
                  className="
                    w-3
                    h-3
                    rounded-full
                    bg-[#05df72]
                    shadow-[0_0_12px_#05df72]
                    animate-pulse
                  "
                />

                <span className="text-xs tracking-[0.25em] opacity-70">
                  CONNECTION READY
                </span>
              </div>
            </div>

            {/* MAIN */}

            <div className="grid lg:grid-cols-[260px_1fr]">
              {/* LEFT PANEL */}

              <div className="border-r border-b border-[#5d6e5d] p-2">
                <h2 className="tracking-[0.25em] text-md bold mb-4">
                  DIRECT CHANNELS
                </h2>

                <div className="space-y-3">
                  <a
                    href="mailto:bhaskarpal256@gmail.com"
                    className="casio-btn block text-center py-2"
                  >
                    EMAIL
                  </a>

                  <a
                    href={resume.links?.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="casio-btn block text-center py-2"
                  >
                    LINKEDIN
                  </a>

                  <a
                    href={resume.links?.github}
                    target="_blank"
                    rel="noreferrer"
                    className="casio-btn block text-center py-2"
                  >
                    GITHUB
                  </a>
                </div>
              </div>

              {/* FORM PANEL */}

              <div className="border-b border-[#5d6e5d] py-4 md:py-2 px-4">
                <h2 className="tracking-[0.25em] text-md mb-4">
                  MESSAGE TERMINAL
                </h2>

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                  <div>
                    <label className="block text-xs opacity-70 mb-2 tracking-[0.2em] ">
                      NAME
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="casio-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs opacity-70 mb-2 tracking-[0.2em]">
                      EMAIL
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="casio-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs opacity-70 mb-2 tracking-[0.2em]">
                      SUBJECT
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="casio-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs opacity-70 mb-2 tracking-[0.2em]">
                      MESSAGE
                    </label>

                    <textarea
                      rows={10}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="casio-input w-full resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="casio-lcd-btn"
                  >
                    {sending ? "TRANSMITTING..." : "TRANSMIT"}
                  </button>
                </form>
              </div>
            </div>

            {/* FOOTER STATUS */}

            <div className="p-2">
              <h2 className="tracking-[0.25em] text-md mb-4">NETWORK STATUS</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#05df72] shadow-[0_0_8px_#05df72]" />
                  AVAILABLE FOR FREELANCE PROJECTS
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#05df72] shadow-[0_0_8px_#05df72]" />
                  AVAILABLE FOR FULL-TIME OPPORTUNITIES
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#05df72] shadow-[0_0_8px_#05df72]" />
                  OPEN SOURCE COLLABORATION
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
