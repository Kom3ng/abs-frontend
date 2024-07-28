"use server"

import {getEmailSchema, getPasswordSchema} from "@/app/[lang]/register/schemas";
import prisma from "@/app/lib/prisma";
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

async function isTurnsliteValid(token: string): Promise<boolean>{
    return await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET,
            response: token
        }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
    }).then(r => r.json()).then(r => r.success === true)
}

function isEmailValid(email: string): boolean{
    return getEmailSchema({}).safeParse(email).success
}

function isPasswordValid(password: string): boolean{
    return getPasswordSchema({}).safeParse(password).success
}

async function sendVerificationEmail(email: string, token: string){
    // TODO
}

function generateToken(): string{
    return ulid()
}