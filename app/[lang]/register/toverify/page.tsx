import { Dict, getDictionary } from "../../dictionaries";

export async function generateStaticParams() {
    return [{ lang: 'en-US' }, { lang: 'zh-CN' }]
}

export default async function ToVerifyPage({params}: { params: { lang: string } }){
    const { lang } = params;
    const dict: Dict = await getDictionary(lang);

    return (
        <div className="w-screen flex justify-center">
            <div className="w-full max-w-screen-xl mt-16">
                <h1>{dict.registerPage?.toVerify?.message}</h1>
            </div>
        </div>
    )
} 