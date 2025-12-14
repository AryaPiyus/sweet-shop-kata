import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/client";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body; 

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || "customer" 
            }
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload
      process.env.JWT_SECRET || 'supersecret', 
      { expiresIn: '1h' }
    );

    // FIX: Send user details back with the token
    res.json({ 
        token,
        user: {
            email: user.email,
            role: user.role // <--- Crucial!
        }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};