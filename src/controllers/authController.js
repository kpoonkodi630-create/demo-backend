
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
    try {
        const {
            childName,
            dateOfBirth,
            parentGuardianName,
            PhoneNumber,
            email,
            programApplyingFor,
            notes,
            password,
            role
        } = req.body;

        // Check required fields
        if (
            !childName ||
            !parentGuardianName ||
            !PhoneNumber ||
            !email ||
            !programApplyingFor ||
            !password  ||
            !role
        ) {
            return res.status(400).json({
                message: "All required fields are required"
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Check existing email
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = await User.create({
            childName,
            dateOfBirth,
            parentGuardianName,
            PhoneNumber,
            email,
            programApplyingFor,
            notes,
            password: hashedPassword,
            role: "Parent"
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                childName: user.childName,
                dateOfBirth: user.dateOfBirth,
                parentGuardianName: user.parentGuardianName,
                PhoneNumber: user.PhoneNumber,
                email: user.email,
                programApplyingFor: user.programApplyingFor,
                notes: user.notes,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                childName: user.childName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};
