"use server"

import { kv } from "@vercel/kv"
import prisma from "../lib/prisma"
import { cookies } from "next/headers"


export default async function getUser(): Promise<User | null> {
    const sessionId = cookies().get('sessionId')?.value

    if (!sessionId){
        return null
    }

    const id = await kv.get<number>(`session:${sessionId}`)

    if (id) {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        if (user) {
            return {
                id: user.id,
                nickName: user.nickName,
                registerDate: user.createdAt,
                avatar: user.avatar,
                birthday: user.birthday
            }
        }
    }

    cookies().delete('sessionId')
    return null
}