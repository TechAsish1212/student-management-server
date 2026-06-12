import { User } from "../models/User.model";

export const SeederAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    const adminUser = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error occurred while seeding admin user:", error);
  }
};
