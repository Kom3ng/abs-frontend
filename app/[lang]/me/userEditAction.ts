"use server"

import getUser from "../userAction"
import prisma from "@/app/lib/prisma"
import { parseUser } from "@/app/lib/serverActionUtils"
import { z } from "zod"

export async function setAvatar(url?: string): Promise<User | null> {
    console.log(url)
    const isUrl = z.string().url().safeParse(url).success
    console.log(isUrl)
    if (!isUrl) return null

    const user = await getUser()
    console.log(user)
    if (!user) return null

    const u = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            avatar: url
        }
    })

    console.log(u)

    return parseUser(u)
}