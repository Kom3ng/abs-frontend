'user server'

import 'server-only'
import { USERS_COLLECTION, getMongodb, redis } from './db';
import { ulid } from 'ulid';
import { ObjectId } from 'mongodb';


const DEFAULT_SESSION_TTL = 60 * 60 * 24 * 183; // 6 months

export const createSession = async (aid: number) => {
    const currentTime = Date.now();
    const sessionId = ulid();

    await redis.hset(`session:${sessionId}`, 'aid', aid, 'createdAt', currentTime);
    await redis.expire(`session:${sessionId}`, DEFAULT_SESSION_TTL);

    return sessionId;
};

export const getUserAidFromSession = async (sessionId: string) => {
    const record = await redis.hget(`session:${sessionId}`, 'aid');
    
    if (record === null) {
        return null;
    }

    return record;
};