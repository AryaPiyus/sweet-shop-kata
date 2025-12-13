import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db/client";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "customer"
            }
        });

        // Return success
        res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = (req: Request, res: Response) => {
    res.status(404).json({ message: "Not implemented" });
};
