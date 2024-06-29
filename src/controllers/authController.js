import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";

export const register = async (req, res) => {
    try {
        const { username, email, password, role, name, rollNumber, course, year } = req.body;

        if ([username, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "Please Fill All Fields" });
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            return res.status(400).json({
                message: "User with same email or username Already Exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });
        
        await user.save();

        if (role === "student") {
            const student = new Student({
                user: user._id,
                name,
                email,
                rollNumber,
                course,
                year,
            });
            await student.save();
        }

        res.status(201).json({ message: "User Created Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Creating User" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ([username, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "Please Fill All Fields" });
        }

        let user = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Logging In" });
    }
};

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({ message: "User Not Authenticated" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(403).json({ message: "User Not Found" });
        }

        const newToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("accessToken", newToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ message: "Token Refreshed Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Refreshing Token" });
    }
};

export const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        await User.findByIdAndUpdate(
            { _id: userId },
            { $unset: { refreshToken: 1 } }
        );

        res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({ message: "User Logged Out Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Logging Out" });
    }
};
