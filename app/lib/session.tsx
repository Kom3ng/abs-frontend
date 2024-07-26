'use server'

import 'server-only'
import { ulid } from 'ulid';
import { kv } from "@vercel/kv";


const DEFAULT_SESSION_TTL = 60 * 60 * 24 * 183; // 6 months

export async function createSession(aid: number) {
    const currentTime = Date.now();
    const sessionId = ulid();


    await kv.hset(`session:${sessionId}`, {
        aid,
        createdAt: currentTime
    });
    await kv.expire(`session:${sessionId}`, DEFAULT_SESSION_TTL);

    return sessionId;
}

export async function getUserAidFromSession(sessionId: string) {
    return await kv.hget(`session:${sessionId}`, 'aid');
}