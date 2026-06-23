import dotenv from "dotenv";
import connectDB from "../db/index.js";
import { Resume } from "../models/resume.model.js";
import { Skill } from "../models/skill.model.js";

dotenv.config();

const seedResume = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // 1️⃣ Check if resume already exists
    const existing = await Resume.findOne();
    if (existing) {
      console.log("⚠️ Resume already exists. Aborting seed.");
      process.exit(0);
    }

    // 2️⃣ Fetch skills (IMPORTANT)
    const skills = await Skill.find().limit(3);

    if (!skills.length) {
      console.log("⚠️ No skills found. Seed skills first.");
      process.exit(0);
    }

    // 3️⃣ Create resume
    const resume = await Resume.create({
      summary:
        "Passionate frontend developer with experience in building responsive and interactive web applications using modern technologies.",

      skills: skills.map((skill) => ({
        skill: skill._id,
        level: "intermediate",
        rating: 7,
      })),

      education: [
        {
          institution: "Bharati Vidyapeeth's College of Engineering, Delhi",
          degree: "B.Tech",
          fieldOfStudy: "Computer Science & Engineering",
          startYear: 2021,
          endYear: 2024,
          grade: "7.9 CGPA",
          description:
            "Focused on web development and software engineering.",
        },
      ],

      experience: [
        {
          company: "Ventibros.",
          role: "Web Developer",
          type: "internship",
          startDate: new Date("2022-08-01"),
          endDate: new Date("2022-09-15"),
          location: "Remote",
          responsibilities: [
            "Built responsive UI using React",
            "Integrated REST APIs",
            "Improved performance and UX",
          ],
        },
      ],

      certifications: [
        {
          title: "Frontend Development Certificate",
          issuer: "Udemy",
          date: new Date("2023-09-15"),
          url: "",
        },
      ],

      resumePdf: {
        url: "https://example.com/resume.pdf",
        public_id: "resume_pdf_id",
      },

      links: {
        website: "https://yourportfolio.com",
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourprofile",
      },

      languages: [
        { name: "English", proficiency: "fluent" },
        { name: "Hindi", proficiency: "native" },
      ],
    });

    console.log("🎉 Resume seeded successfully!");
    console.log(resume);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding resume:", error);
    process.exit(1);
  }
};

seedResume();