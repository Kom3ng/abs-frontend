import { getDictionary } from "../dictionaries";
import LoginForm from "./LoginForm";

export default async function loginPage({params}: {params: { lang: string }}) {
    const { lang } = params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
                    {dict.loginPage?.formTitle}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <LoginForm dict={dict} lang={lang} />
            </div>
        </div>
    )
}