"use server"

import prisma from "@/app/lib/prisma";

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: {
            id: id
        }
    });
}
