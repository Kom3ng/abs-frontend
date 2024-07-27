"use client"

import React, { useRef, useState } from "react";
import { Dict } from "@/app/[lang]/dictionaries";
import { getEmailSchema, getPasswordSchema } from "@/app/[lang]/register/schemas";
import register from "./register";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginForm({ dict }: { dict: Dict }) {
    const [emailHint, setEmailHint] = useState<string>('');
    const [passwordHint, setPasswordHint] = useState<string>('');

    const [isEmailCorrect, setEmailCorrect] = useState(false);
    const [isPasswordCorrect, setPasswordCorrect] = useState(false);

    const emailSchema = getEmailSchema(dict);
    const passwordSchema = getPasswordSchema(dict);

    const { pending } = useFormStatus()
    const [state, formAction] = useFormState(register, {})

    return <>
        <form className="space-y-6" action={formAction}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="input w-full"
                        onChange={e => {
                            const value = e.target.value;
                            const result = emailSchema.safeParse(value);

                            if (!result.success) {
                                setEmailHint(result.error.format()._errors[0]);
                                return;
                            }

                            setEmailHint('');
                            setEmailCorrect(true);
                        }}
                    />
                    {emailHint && <p className="text-sm text-red-500">{emailHint}</p>}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6">
                        Password
                    </label>
                    <div className="text-sm">
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </a>
                    </div>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="input w-full"
                        onChange={e => {
                            const value = e.target.value;
                            const result = passwordSchema.safeParse(value);

                            if (!result.success) {
                                setPasswordHint(result.error.format()._errors[0]);
                                return;
                            }

                            setPasswordHint('');
                            setPasswordCorrect(true);
                        }}
                    />
                    {passwordHint && <p className="text-sm text-red-500">{passwordHint}</p>}
                </div>
            </div>

            <div>
                <button
                    disabled={!isEmailCorrect || !isPasswordCorrect || pending}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm disabled:bg-indigo-500 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {dict.register}
                </button>
            </div>

            {stateHint(state, dict)}
        </form>
    </>;
}

function stateHint(state: RegisterResult, dict: Dict){
    console.log(state)

    if (Object.keys(state).length === 0) {
        return <></>
    }

    if (state.success) {
        return <div className="text-green-500">{dict.registerSuccess}</div>
    }

    const msg = (() => {
        switch(state.errorType){
            case 'invalid-email': dict.errors?.input?.email?.invalid
            case 'email-exists': dict.errors?.input?.email?.exist
            case 'invalid-password': dict.errors?.input?.password?.invalid
            case 'server-error': dict.errors?.server
            default: return dict.errors?.unkown
        }
    })()

    return <div className="text-red-500">{msg}</div>
}