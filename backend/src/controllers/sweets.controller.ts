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

export const updateSweet: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, quantity } = req.body;

    const sweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        category,
        quantity
      }
    });

    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sweet' });
  }
};

export const deleteSweet: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.sweet.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sweet' });
  }
};

export const restockSweet: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const sweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: {
        quantity: { increment: Number(amount) }
      }
    });

    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Error restocking sweet' });
  }
};

export const purchaseSweet: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const sweetId = Number(id);
    const purchaseAmount = Number(amount);

    const result = await prisma.$transaction(async (tx) => {
      const sweet = await tx.sweet.findUnique({
        where: { id: sweetId }
      });

      if (!sweet) {
        throw new Error('Sweet not found');
      }

      if (sweet.quantity < purchaseAmount) {
        throw new Error('Insufficient stock');
      }

      const updatedSweet = await tx.sweet.update({
        where: { id: sweetId },
        data: {
          quantity: sweet.quantity - purchaseAmount
        }
      });

      return updatedSweet;
    });

    res.status(200).json(result);

  } catch (error: any) {
    if (error.message === 'Insufficient stock') {
      res.status(400).json({ message: 'Insufficient stock' });
    } else if (error.message === 'Sweet not found') {
      res.status(404).json({ message: 'Sweet not found' });
    } else {
      res.status(500).json({ message: 'Error processing purchase' });
    }
  }
};