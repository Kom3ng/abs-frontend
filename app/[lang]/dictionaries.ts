import { redirect } from 'next/navigation';
import 'server-only'

type Dictionary = {
    [key: string]: () => Promise<any>;
};

const dictionaries: Dictionary = {
    "en-US": () => import('./dictionaries/en-US.json').then((module) => module.default),
    "zh-CN": () => import('./dictionaries/zh-CN.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  const dict = dictionaries[locale];

  return dict();
}
