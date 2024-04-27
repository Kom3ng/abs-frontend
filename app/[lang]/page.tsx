import { getDictionary } from "./dictionaries";

export async function generateStaticParams() {
  return [{ lang: 'en-UK' }, { lang: 'zh-CN' }]
}

export default async function Home({params}: {params: { lang: string }}) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return (
    <>
      <main className="min-h-screen">
        <div className="flex flex-center justify-center mt-40 space-x-8 divide-x-2">
          <div>
            <h1 className="text-6xl font-extrabold">{dict.name}</h1>
            <p>test test...</p>
            <p>next generation!</p>
          </div>
          <div>
            <p>some awesome images</p>
            <p>some awesome quotes</p>
          </div>
        </div>
        <div className="m-8 mt-20">
          <div>
            <h1 className="font-bold text-2xl">What do we do?</h1>
            <p>Super secret orgnazation!</p>
          </div>
        </div>
        <div className="m-8 mt-20">
          <div>
            <h1 className="font-bold text-2xl">About us</h1>
            <p>aaaaaaaaaaaaaaa</p>
          </div>
        </div>
        <div className="m-8 mt-20">
          <div className="font-bold text-2xl">Members</div>
          <p>Not public</p>
        </div>
      </main>
    </>
  );
}
