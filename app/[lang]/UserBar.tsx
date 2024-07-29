import { cookies } from "next/headers";
import { Dict } from "./dictionaries";
import Image from "next/image";
import getUser from "./userAction";

export default async function UserBar({ dict, lang }: { dict: Dict, lang: string }) {
    const cookie = cookies();
    const sessionId = cookie.get('sessionId')?.value;
    if (sessionId) {
        const user = await getUser(sessionId);

        if (user){
            return (
                <Image src={user.avatar || ''} alt="avatar" width={40} height={40} className="rounded-full" />
            )
        }        
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