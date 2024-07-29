// noinspection ES6MissingAwait

"use server"

import transporter from "@/app/lib/email";
import prisma from "@/app/lib/prisma";
import { isEmailValid, isPasswordValid, isTurnsliteValid } from "@/app/lib/schemas";
import { kv } from "@vercel/kv";
import { createHash, randomUUID } from "crypto";
import { ulid } from "ulid";

export default async function register(f: FormData, turnsliteToken: string): Promise<RegisterResult> {
    const email = f.get('email')?.toString()
    const password = f.get('password')?.toString()

    if (email === undefined || password === undefined){
        return {}
    }

    if (!isEmailValid(email)){
        return {
            success: false,
            errorType: 'invalid-email'
        }
    }

    if (!isPasswordValid(password)){
        return {
            success: false,
            errorType: 'invalid-password'
        }
    }

    if (!await isTurnsliteValid(turnsliteToken)){
        return {
            success: false,
            errorType: 'turnslite-failed'
        }
    }

    if (await isEmailExists(email)) {
        return {
            success: false,
            errorType: 'email-exists'
        }
    }

    const salt = randomUUID()
    const hash = createHash('sha256')
    hash.update(password+salt)
    const passwordHash = hash.digest('base64')
    
    const token = generateToken()
    
    const kvKey = `verficationToken:${token}`


    kv.hset(kvKey, {
        password: passwordHash,
        email,
        salt
    })
    
    kv.expire(kvKey, 24 * 60 * 60)

    sendVerificationEmail(email, token)

    return { success: true }
}

async function isEmailExists(email: string | undefined) {
    return await prisma.account.findUnique({
        where: {
            email,
        }
    }).then(r => r !== null);
}

async function sendVerificationEmail(email: string, token: string){
    transporter.sendMail({
        from: '"Abstruack" noreply@abs.astrack.me',
        to: email,
        subject: 'Verify your email',
        html: `<a href="https://abs.astrack.me/register/verify?token=${token}">Click here to verify your email</a> </br> or copy and paste this link to your browser: https://abs.astrack.me/register/verify?token=${token}`
    })
}

function generateToken(): string{
    return ulid()
}