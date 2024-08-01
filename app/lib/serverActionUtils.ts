import "server-only"

import { User as UserType } from '@prisma/client';

export function parseUser(u: UserType | null): User | null{
    if (!u) return null

    return {
        id: u.id,
        nickName: u.nickName,
        avatar: u.avatar,
        registerDate: u.createdAt,
        birthday: u.birthday
    }
}