const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

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

const questionSchema = new mongoose.Schema({
    title: String,
    content: String,
    answer: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now },
});
const Question = mongoose.model("Question", questionSchema);

const competitionSchema = new mongoose.Schema({
    name: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    authorizedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startTime: Date,
    endTime: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});
const Competition = mongoose.model("Competition", competitionSchema);

// JWT Secret Key
const JWT_SECRET = "your_secret_key_here";

// Middleware to authenticate JWT Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting 'Bearer TOKEN'

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token." });
        req.user = user; // Contains id, username, role
        next();
    });
}

// Middleware to verify Admin role
function authenticateAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
}

// =========================
// User Registration
// =========================
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ error: "Username already exists." });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
});

// =========================
// User Login
// =========================
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "Invalid username or password." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: "Invalid username or password." });

        // Generate JWT Token with role
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// =========================
// Protected Routes
// =========================

// Create a question
app.post("/api/questions", authenticateToken, async (req, res) => {
    const { title, content, answer, tags } = req.body;

    // Validate input
    if (!title || !content || !answer) {
        return res.status(400).json({ error: "Title, content, and answer are required." });
    }

    try {
        const question = await Question.create({ title, content, answer, tags });
        res.status(201).json({ message: "Question created successfully.", question });
    } catch (err) {
        res.status(500).json({ error: "Error creating question." });
    }
});

// Create a competition
app.post("/api/competitions", authenticateToken, async (req, res) => {
    const { name, questionIds, userIds, startTime, endTime } = req.body;

    // Validate input
    if (!name || !questionIds || !startTime || !endTime) {
        return res.status(400).json({ error: "Name, questionIds, startTime, and endTime are required." });
    }

    try {
        const competition = await Competition.create({
            name,
            questions: questionIds,
            authorizedUsers: userIds,
            startTime,
            endTime,
            createdBy: req.user.id,
        });

        // Add competition to each user's competitions array
        if (userIds && userIds.length > 0) {
            await User.updateMany(
                { _id: { $in: userIds } },
                { $push: { competitions: competition._id } }
            );
        }

        res.status(201).json({ message: "Competition created successfully.", competition });
    } catch (err) {
        res.status(500).json({ error: "Error creating competition." });
    }
});

// Get all competitions for a user
app.get("/api/competitions", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "competitions",
            populate: { path: "questions", select: "title content tags" },
        });

        if (!user) return res.status(404).json({ error: "User not found." });

        res.json(user.competitions);
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// Get questions for a specific competition
app.get("/api/competitions/:competitionId/questions", authenticateToken, async (req, res) => {
    const { competitionId } = req.params;

    try {
        const competition = await Competition.findById(competitionId)
            .populate("questions")
            .populate("authorizedUsers");

        if (!competition) return res.status(404).json({ error: "Competition not found." });

        // Check if user is authorized for the competition
        const isAuthorized = competition.authorizedUsers.some(
            (user) => user._id.toString() === req.user.id
        );

        if (!isAuthorized) {
            return res.status(403).json({ error: "You are not authorized to access this competition." });
        }

        res.json(competition.questions);
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// Add a user to a competition
app.post("/api/competitions/:competitionId/add-user", authenticateToken, async (req, res) => {
    const { competitionId } = req.params;
    const { userId } = req.body;

    // Validate input
    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const competition = await Competition.findById(competitionId);
        if (!competition) return res.status(404).json({ error: "Competition not found." });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found." });

        // Add user to competition and competition to user's list
        if (!competition.authorizedUsers.includes(userId)) {
            competition.authorizedUsers.push(userId);
            await competition.save();
        }

        if (!user.competitions.includes(competitionId)) {
            user.competitions.push(competitionId);
            await user.save();
        }

        res.json({ message: "User added to competition successfully." });
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// =========================
// Admin Routes
// =========================

const adminRouter = express.Router();

// Apply authentication and admin middleware to all admin routes
adminRouter.use(authenticateToken);
adminRouter.use(authenticateAdmin);

// -------------------------
// Admin User Management
// -------------------------

// Get all users
adminRouter.get("/users", async (req, res) => {
    try {
        const users = await User.find().populate("competitions", "name startTime endTime");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// Create a new user
adminRouter.post("/users", async (req, res) => {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ error: "Username, password, and role are required." });
    }

    // Ensure role is valid
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified." });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: "User created successfully.", user });
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ error: "Username already exists." });
        } else {
            res.status(500).json({ error: "Error creating user." });
        }
    }
});

// Update a user
adminRouter.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    // Validate role if provided
    if (role) {
        const validRoles = ["user", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role specified." });
        }
    }

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found." });

        if (username) user.username = username;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role) user.role = role;

        await user.save();
        res.json({ message: "User updated successfully.", user });
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ error: "Username already exists." });
        } else {
            res.status(500).json({ error: "Error updating user." });
        }
    }
});

// Delete a user
adminRouter.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: "User not found." });

        // Optionally, remove the user from competitions
        await Competition.updateMany(
            { authorizedUsers: id },
            { $pull: { authorizedUsers: id } }
        );

        res.json({ message: "User deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "Error deleting user." });
    }
});

// -------------------------
// Admin Question Management
// -------------------------

// Get all questions
adminRouter.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// Create a new question
adminRouter.post("/questions", async (req, res) => {
    const { title, content, answer, tags } = req.body;

    // Validate input
    if (!title || !content || !answer) {
        return res.status(400).json({ error: "Title, content, and answer are required." });
    }

    try {
        const question = await Question.create({ title, content, answer, tags });
        res.status(201).json({ message: "Question created successfully.", question });
    } catch (err) {
        res.status(500).json({ error: "Error creating question." });
    }
});

// Update a question
adminRouter.put("/questions/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content, answer, tags } = req.body;

    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ error: "Question not found." });

        if (title) question.title = title;
        if (content) question.content = content;
        if (answer) question.answer = answer;
        if (tags) question.tags = tags;

        await question.save();
        res.json({ message: "Question updated successfully.", question });
    } catch (err) {
        res.status(500).json({ error: "Error updating question." });
    }
});

// Delete a question
adminRouter.delete("/questions/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Question.findByIdAndDelete(id);
        if (!question) return res.status(404).json({ error: "Question not found." });

        // Optionally, remove the question from competitions
        await Competition.updateMany(
            { questions: id },
            { $pull: { questions: id } }
        );

        res.json({ message: "Question deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "Error deleting question." });
    }
});

// -------------------------
// Admin Competition Management
// -------------------------

// Get all competitions
adminRouter.get("/competitions", async (req, res) => {
    try {
        const competitions = await Competition.find()
            .populate("questions")
            .populate("authorizedUsers", "username role")
            .populate("createdBy", "username");

        res.json(competitions);
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// Create a new competition
adminRouter.post("/competitions", async (req, res) => {
    const { name, questionIds, userIds, startTime, endTime } = req.body;

    // Validate input
    if (!name || !questionIds || !startTime || !endTime) {
        return res.status(400).json({ error: "Name, questionIds, startTime, and endTime are required." });
    }

    try {
        const competition = await Competition.create({
            name,
            questions: questionIds,
            authorizedUsers: userIds,
            startTime,
            endTime,
            createdBy: req.user.id,
        });

        // Add competition to each user's competitions array
        if (userIds && userIds.length > 0) {
            await User.updateMany(
                { _id: { $in: userIds } },
                { $push: { competitions: competition._id } }
            );
        }

        res.status(201).json({ message: "Competition created successfully.", competition });
    } catch (err) {
        res.status(500).json({ error: "Error creating competition." });
    }
});

// Update a competition
adminRouter.put("/competitions/:id", async (req, res) => {
    const { id } = req.params;
    const { name, questionIds, userIds, startTime, endTime } = req.body;

    try {
        const competition = await Competition.findById(id);
        if (!competition) return res.status(404).json({ error: "Competition not found." });

        if (name) competition.name = name;
        if (questionIds) competition.questions = questionIds;
        if (userIds) competition.authorizedUsers = userIds;
        if (startTime) competition.startTime = startTime;
        if (endTime) competition.endTime = endTime;

        await competition.save();

        // Optionally, update users' competitions lists
        if (userIds) {
            // Remove competition from users not in the new list
            await User.updateMany(
                { competitions: competition._id, _id: { $nin: userIds } },
                { $pull: { competitions: competition._id } }
            );
            // Add competition to new users
            await User.updateMany(
                { _id: { $in: userIds }, competitions: { $ne: competition._id } },
                { $push: { competitions: competition._id } }
            );
        }

        res.json({ message: "Competition updated successfully.", competition });
    } catch (err) {
        res.status(500).json({ error: "Error updating competition." });
    }
});

// Delete a competition
adminRouter.delete("/competitions/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const competition = await Competition.findByIdAndDelete(id);
        if (!competition) return res.status(404).json({ error: "Competition not found." });

        // Remove competition from users' competitions lists
        await User.updateMany(
            { competitions: id },
            { $pull: { competitions: id } }
        );

        res.json({ message: "Competition deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "Error deleting competition." });
    }
});

// Mount admin router
app.use("/api/admin", adminRouter);

// =========================
// Start the Server
// =========================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});