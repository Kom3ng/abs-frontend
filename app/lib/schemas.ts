import {Dict} from "@/app/[lang]/dictionaries";
import {z} from "zod";

export const getPasswordSchema = (dict: Dict) => {
    return z.string({
        required_error: dict.errors?.input?.password?.required
    })
        .min(6, dict.errors?.input?.password?.minlength)
        .max(20, dict.errors?.input?.password?.maxlength)
        .refine(value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{6,}$/.test(value), {
            message: dict.errors?.input?.password?.invalid,
        });
};

export const getEmailSchema = (dict: Dict) => {
    return z.string({
        required_error: dict.errors?.input?.email?.required
    })
        .email(dict.errors?.input?.email?.invalid);
}

export const getNicknameSchema = (dict: Dict) => {
    return z.string({
        required_error: dict.errors?.input?.nickname?.required
    })
        .min(1, dict.errors?.input?.nickname?.minlength)
        .max(20, dict.errors?.input?.nickname?.maxlength);
}

export function isEmailValid(email: string): boolean{
    return getEmailSchema({}).safeParse(email).success
}

export function isPasswordValid(password: string): boolean{
    return getPasswordSchema({}).safeParse(password).success
}

export async function isTurnsliteValid(token: string): Promise<boolean>{
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