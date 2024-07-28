"use server"

import prisma from "@/app/lib/prisma"
import { kv } from "@vercel/kv"

export async function verifyToken(token: string): Promise<boolean> {
    const kvKey = `verficationToken:${token}`

    if (!await kv.exists(kvKey)){
        return false
    }

    const [email, password, salt] = await Promise.all([
        kv.hget<string>(kvKey, 'email'),
        kv.hget<string>(kvKey, 'password'),
        kv.hget<string>(kvKey, 'salt')
    ])

    kv.del(kvKey)

    if (!email || !password || !salt){
        return false
    }

    try {
        const user = await prisma.user.create({
            data: {
                account: {
                    create: {
                        email,
                        password,
                        salt,
                    }
                }
            }
        })

        if (user === null){
            return false
        }
    } catch(e) {
        return false
    }

    return true
}