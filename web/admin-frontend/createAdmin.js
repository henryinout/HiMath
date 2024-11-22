// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/math_game", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('strictQuery', true); // To suppress deprecation warnings

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, index: true },
    password: String,
    competitions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competition" }],
    role: { type: String, default: "user" },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// Function to create admin user
async function createAdmin(username, password) {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ username });
        if (existingAdmin) {
            console.log(`User with username "${username}" already exists.`);
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const adminUser = new User({
            username,
            password: hashedPassword,
            role: "admin",
        });

        await adminUser.save();
        console.log(`Admin user "${username}" created successfully.`);
    } catch (err) {
        console.error("Error creating admin user:", err.message);
    } finally {
        mongoose.disconnect();
    }
}

// 替换为您的管理员用户名和密码
const adminUsername = "admin";
const adminPassword = "2:5Y8YGkmGdY2yJ"; // 替换为强密码

createAdmin(adminUsername, adminPassword);