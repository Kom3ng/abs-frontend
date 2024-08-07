"use server"

import prisma from "@/app/lib/prisma"
import { isTurnsliteValid } from "@/app/lib/schemas"
import { kv } from "@vercel/kv"
import { createHash } from "crypto"
import { cookies } from "next/headers"
import { ulid } from "ulid"

const sessionMaxAge = 4 * 30 * 24 * 60 * 60
const isProduction = process.env.NODE_ENV === 'production'

export default async function login(f: FormData, turnsliteToken: string): Promise<LoginResult>{
    const email = f.get('email')?.toString()
    const password = f.get('password')?.toString()

    if (email === undefined || password === undefined){
        return {}
    }

    if (!await isTurnsliteValid(turnsliteToken)){
        return {
            success: false,
            errorType: 'turnslite-failed'
        }
    }

    const account = await prisma.account.findUnique({
        where: {
            email
        }
    })

    if (!account){
        return {
            success: false,
            errorType: 'email-or-password-incorrect'
        }
    }

    const salt = account.salt
    const passwordHash = account.password

    const hash = createHash('sha256')
    hash.update(password+salt)
    
    if(hash.digest('base64') === passwordHash){
        const sessionId = ulid()
        kv.set(`session:${sessionId}`, account.userId, {
            ex: sessionMaxAge
        })

        const cookie = cookies()
        cookie.set('sessionId', sessionId, {
            maxAge: sessionMaxAge,
            httpOnly: true,
            secure: isProduction,
        })
        
        const user = await prisma.user.findUnique({
            where: {
                id: account.userId
            }
        })

        return {
            success: true,
            data: user ? {
                id: user.id,
                nickName: user.nickName,
                registerDate: user.createdAt,
                avatar: user.avatar,
                birthday: user.birthday
            } : undefined
        }
    }
    
    return {
        success: false,
        errorType: 'email-or-password-incorrect'
    }
}