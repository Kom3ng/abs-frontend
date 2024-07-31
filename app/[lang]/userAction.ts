"use server"

import { kv } from "@vercel/kv"
import prisma from "../lib/prisma"
import { cookies } from "next/headers"

export default async function getUser() {
    const sessionId = cookies().get('sessionId')?.value

    if (!sessionId){
        return null
    }

    const id = await kv.get<number>(`session:${sessionId}`)

    if (!id) {
        cookies().delete('sessionId')
        return null
    }

    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}