"use client"

import { Dict } from "./dictionaries";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "./UserPovider";

export default function UserBar({ dict, lang }: { dict: Dict, lang: string }) {
    const { user } = useContext(UserContext);

    if (user) {
        return (
            <Image src={user.avatar || ''} alt="avatar" width={40} height={40} className="rounded-full" />
        )
    }

    return (
        <>
            <a href={`/${lang}/login`}>{dict.login}</a>
            <div className="flex items-center rounded bg-neutral-800 dark:bg-neutral-200 h-full">
                <a href={`/${lang}/register`} className="m-2 text-neutral-50 dark:text-neutral-900">{dict.register}</a>
            </div>
        </>
    )
}