"use server"

import {getEmailSchema, getPasswordSchema} from "@/app/[lang]/register/schemas";
import prisma from "@/app/lib/prisma";
import { createHash, randomUUID } from "crypto";

export default async function register(f: FormData, turnsliteToken: string): Promise<RegisterResult> {
    const turnsliteResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET,
            response: turnsliteToken
        }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
    })

    const c = await turnsliteResult.json()

    if (!c.success){
        return {
            success: false,
            errorType: 'turnslite-failed'
        }
    }
    
    const email = f.get('email')?.toString()
    const password = f.get('password')?.toString()

    const emailSchema = getEmailSchema({});
    const passwordSchema = getPasswordSchema({});

    if (!emailSchema.safeParse(email).success){
        return {
            success: false,
            errorType: 'invalid-email'
        }
    }

    if (!passwordSchema.safeParse(password).success){
        return {
            success: false,
            errorType: 'invalid-password'
        }
    }

    const result = await prisma.account.findUnique({
        where: {
            email,
        }
    })

    if (result != null) {
        return {
            success: false,
            errorType: 'email-exists'
        }
    }

    const salt = randomUUID()
    const hash = createHash('sha256')
    hash.update(password+salt)

    const r = await prisma.account.create({
        data: {
            email: email || '',
            password: hash.digest('base64'),
            salt
        }
    })

    if (r === null){
        return {
            success: false,
            errorType: 'server-error'
        }
    }

    // TODO send email

    return { success: true }
}