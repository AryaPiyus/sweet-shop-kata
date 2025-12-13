import prisma from "../db/client";

export const cleanDb = async ()=>{
    await prisma.user.deleteMany();
    await prisma.sweet.deleteMany();
};

export default prisma;
