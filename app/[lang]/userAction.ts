"use server"

import { kv } from "@vercel/kv"
import prisma from "../lib/prisma"
import { cookies } from "next/headers"

export default async function getUser(sessionId: string) {
    const id = await kv.get<number>(`session:${sessionId}`)

    if (!id) {
        const cookie = cookies()
        cookie.delete('sessionId')
        return null
    }

    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}