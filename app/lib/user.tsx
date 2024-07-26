"use server"

import prisma from "@/app/lib/prisma";

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: {
            id: id
        }
    });
}

export const addSessionForUser = async (userId: number, sessionId: string) => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            sessions: {
                create: {
                    sessionId,
                }
            }
        }
    })
}
