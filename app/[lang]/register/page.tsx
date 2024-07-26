import {getDictionary} from "@/app/[lang]/dictionaries";
import React from "react";
import LoginForm from "@/app/[lang]/register/LoginForm";

export async function generateStaticParams() {
    return [{ lang: 'en-US' }, { lang: 'zh-CN' }]
}

export default async function RegisterPage({params}: { params: { lang: string } }) {
    const { lang} = params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
                    {dict.register}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <LoginForm dict={dict} />
            </div>
        </div>
    )
}