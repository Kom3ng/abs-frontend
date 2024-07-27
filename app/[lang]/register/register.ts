"use server"

import {getEmailSchema, getPasswordSchema} from "@/app/[lang]/register/schemas";
import prisma from "@/app/lib/prisma";
import { createHash, randomUUID } from "crypto";

export default async function register(prevState: any, f: FormData): Promise<RegisterResult> {
    const email = f.get('email')?.toString()
    const password = f.get('password')?.toString()

    // @ts-ignore
    const emailSchema = getEmailSchema(undefined);
    // @ts-ignore
    const passwordSchema = getPasswordSchema(undefined);

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