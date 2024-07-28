"use client"

import React, { useRef, useState } from "react";
import { Dict } from "@/app/[lang]/dictionaries";
import { getEmailSchema, getPasswordSchema } from "@/app/[lang]/register/schemas";
import register from "./register";
import { useFormStatus } from "react-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";

export default function LoginForm({ dict, lang }: { dict: Dict, lang: string }) {
    const [emailHint, setEmailHint] = useState<string>('');
    const [passwordHint, setPasswordHint] = useState<string>('');

    const [isEmailCorrect, setEmailCorrect] = useState(false);
    const [isPasswordCorrect, setPasswordCorrect] = useState(false);

    const [isShowTurnstile, setShowTurnstile] = useState(false);

    const emailSchema = getEmailSchema(dict);
    const passwordSchema = getPasswordSchema(dict);

    const turnstileToken = useRef<string>('');
    const [isTurnsliteSuccess, setTurnstileSuccess] = useState(false);

    const [state, setState] = useState({});

    return <>
        <form className="space-y-6" action={async (e) => {
            const result = await register(e, turnstileToken.current);
            setState(result);
        }}>
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

                            setShowTurnstile(true);
                        }}
                    />
                    {passwordHint && <p className="text-sm text-red-500">{passwordHint}</p>}
                </div>
            </div>

            { isShowTurnstile && <Turnstile 
            siteKey="0x4AAAAAAAf8kP7KFZJVZWRx" 
            onSuccess={token => {
                turnstileToken.current = token;
                setTurnstileSuccess(true);
            }}
            onExpire={() => setTurnstileSuccess(false)}
            onError={() => setTurnstileSuccess(false)}
             /> }

            <div>
                <SubmitButton isEmailCorrect={isEmailCorrect} isPasswordCorrect={isPasswordCorrect} isTurnsliteSuccess={isTurnsliteSuccess} dict={dict} />
            </div>

            <StateHint lang={lang} state={state} dict={dict} />
        </form>
    </>;
}

function SubmitButton({ isEmailCorrect, isPasswordCorrect, isTurnsliteSuccess, dict }: { isEmailCorrect: boolean, isPasswordCorrect: boolean, isTurnsliteSuccess: boolean, dict: Dict }) {
    const { pending } = useFormStatus()

    return (
        <button
            disabled={!isEmailCorrect || !isPasswordCorrect || !isTurnsliteSuccess || pending }
            type="submit"
            className="flex space-x-2 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm disabled:bg-indigo-500 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            <div>{pending && <FontAwesomeIcon spin icon={faSpinner} />}</div>
            <div>{dict.register}</div>
        </button>
    )
}

function StateHint({ state, dict, lang }: { state: RegisterResult, dict: Dict, lang: string }) {
    const router = useRouter();

    if (Object.keys(state).length === 0) {
        return <></>
    }

    if (state.success) {
        router.push(`/${lang}/register/toverify`)
        return <div className="text-green-500">{dict.registerSuccess}</div>
    }

    const msg = (() => {
        switch (state.errorType) {
            case 'invalid-email': return dict.errors?.input?.email?.invalid
            case 'email-exists': return dict.errors?.input?.email?.exist
            case 'invalid-password': return dict.errors?.input?.password?.invalid
            case 'server-error': return dict.errors?.server
            case 'turnslite-failed': return dict.errors?.turnsliteFailed
            default: return dict.errors?.unkown
        }
    })()

    return <div className="text-red-500">{msg}</div>
}