'use server'

import 'server-only'
import Redis from 'ioredis'
import { MongoClient } from 'mongodb';

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REFIS_USER,
    password: process.env.REDIS_PASS,
    port: Number.parseInt(process.env.REDIS_PORT || '6379'),
    lazyConnect: true,
    showFriendlyErrorStack: true,
    enableAutoPipelining: true,
    maxRetriesPerRequest: 0,
    retryStrategy: (times: number) => {
        if (times > 3) {
            throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
    },
});


redis.on('error', (error: unknown) => {
    console.warn('[Redis] Error connecting', error);
});

export const getMongodb = async () => {
    if (_mongodb === null) {
        _mongodb = new MongoClient(process.env.MONGODB_URI!, {
            tls: false,
        });

        await _mongodb.connect();
    }

    return _mongodb;
};

let _mongodb: MongoClient | null = null;

process.on('exit', async () => {
    if (_mongodb !== null) {
        await _mongodb.close();
    }

    redis.disconnect();
});

export const USERS_COLLECTION = process.env.USERS_COLLECTION!;