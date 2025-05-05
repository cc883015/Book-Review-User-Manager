require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user");

const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/book-review-system";

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");

    // 检查如果用户已经存在
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // 创建用户
    const admin = new User({
      username: "admin",
      password: "admin123",
      is_admin: true
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

main();
