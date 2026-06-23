import dotenv from "dotenv";
import { User } from "../models/user.model.js"; // update path if needed
import connectDB from "../db/index.js";

dotenv.config();


async function createAdmin() {
  try {
   

await connectDB();
    console.log("✅ Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL; // change before running
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD; // change before running

    // 1️⃣ Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Aborting seed.");
      process.exit(0);
    }


    // 3️⃣ Create admin user
    const adminUser = await User.create({
      username: adminUsername,
      email: adminEmail,
      fullName: "Super Admin",
      password: adminPassword,
      role: "admin",
      avatar: {
        url: "",
        public_id: "",
      },
      refreshToken: "",
    });

    console.log("🎉 Admin user created successfully:");
    console.log(adminUser);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

createAdmin();
