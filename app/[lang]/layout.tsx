import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getDictionary } from "./dictionaries";
import Image from "next/image";
import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import UserBar from "./UserBar";
import UserProvider from "./UserPovider";
import getUser from "./userAction";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abstruck",
  description: "Official website of Abstruck",
};

export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'zh-CN' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = params;

  const dict = await getDictionary(lang);

  return (
    <html lang={`${lang}`}>
      <body className={`${jetBrainsMono.className} text-neutral-950 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-950`}>
        <UserProvider>
          <nav>
            <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center w-full max-w-screen-xl">
                <div className="flex space-x-4 items-center m-4">
                  <a href={`/${lang}/`} className="font-bold text-2xl">{dict.name}</a>
                  <a href={`/${lang}/about`}>{dict.nav?.about}</a>
                  <a href={`/${lang}/products`}>{dict.nav?.products}</a>
                </div>
                <div className="flex space-x-4 items-center m-4">
                  <a target="_blank" href="https://github.com/abstruck-studio">
                    <Image src="/_/github-mark.svg" alt="github" className="block dark:hidden" width={24} height={24} />
                    <Image src="/_/github-mark-white.svg" alt="github" className="hidden dark:block" width={24} height={24} />
                  </a>
                  <UserBar dict={dict} lang={lang} />
                </div>
              </div>
            </div>
          </nav>
          {children}
        </UserProvider>
      </body>
      <GoogleAnalytics gaId="G-28G82HPB53" />
    </html>
  );
}
