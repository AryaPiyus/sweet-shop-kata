import { Request, Response, RequestHandler } from 'express';
import prisma from '../db/client';
import { AuthRequest } from '../middlewear/auth'; 

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, category, quantity } = req.body;

    const sweet = await prisma.sweet.create({
      data: {
        name,
        price,
        category,
        quantity
      }
    });

    res.status(201).json(sweet);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error creating sweet' });
  }
};
export const listSweets: RequestHandler = async (req, res) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sweets' });
  }
};