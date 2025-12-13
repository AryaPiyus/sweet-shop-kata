import prisma from "../db/client";

export const cleanDb = async ()=>{
    await prisma.user.deleteMany();
};

export default prisma;
