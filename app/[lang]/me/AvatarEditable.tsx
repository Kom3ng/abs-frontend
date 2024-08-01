"use client"

import Image from "next/image";
import classNames from "classnames";
import { useContext, useState } from "react";
import { UserContext } from "../UserPovider";
import { Dict } from "../dictionaries";
import { z } from "zod";
import { useFormState, useFormStatus } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { setAvatar } from "./userEditAction";

interface UrlState {
    correct: boolean,
    errorHint?: string
}

export default function AvatarEditable({ className, dict }: { className?: string, dict: Dict }) {
    const { user, setUser } = useContext(UserContext);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [isMouseIn, setMouseIn] = useState<boolean>(false);
    const [urlState, setUrlState] = useState<UrlState>({ correct: false });
    const urlSchema = z.string().url(dict.me?.avatar?.invalidUrl);

    return (
        <>
            <div
                onMouseEnter={() => setMouseIn(true)}
                onMouseLeave={() => setMouseIn(false)}
                className={classNames("relative", className)}
            >
                <Image
                    src={user?.avatar || ""}
                    alt="avatar"
                    height={300}
                    width={300}
                    className={classNames(
                        "rounded-full",
                        "transition-all",
                        "duration-300",
                        {
                            "blur-sm": isMouseIn,
                            "brightness-50": isMouseIn
                        }
                    )}
                />
                <div
                    onClick={() => setShowEditor(true)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                    {dict.me?.avatar?.openEditor}
                </div>
            </div>
            {showEditor && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowEditor(false)}></div>
                    <div className="relative shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 rounded">
                        <form
                            className="space-y-4"
                            action={async (formData) => {
                                setUser(await setAvatar(formData.get('url')?.toString()));
                                setShowEditor(false);
                            }}
                        >
                            <label htmlFor="url" className="block text-sm font-medium leading-6">
                                {dict.me?.avatar?.uploadHint}
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    id="url"
                                    name="url"
                                    type="text"
                                    className="input w-full"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const result = urlSchema.safeParse(value);

                                        if (!result.success) {
                                            setUrlState({ correct: false, errorHint: result.error.format()._errors[0] });
                                            return;
                                        }

                                        setUrlState({ correct: true });
                                    }}
                                />
                                <SubmitButton disabled={!urlState.correct}>{dict.me?.avatar?.confirm}</SubmitButton>
                            </div>
                            {urlState.errorHint && <p className="text-sm text-red-500">{urlState.errorHint}</p>}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export function SubmitButton({ children, disabled }: { disabled?: boolean, children?: React.ReactNode }) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="button-primary"
            disabled={pending || disabled}>
            <div className="space-x-2 flex items-center">
                <div>{pending && <FontAwesomeIcon spin icon={faSpinner} />}</div>
                {children}
            </div>
        </button>
    )
}