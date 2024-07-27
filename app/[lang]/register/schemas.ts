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