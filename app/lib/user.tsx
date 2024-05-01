import { ObjectId } from "mongodb"

type User = {
    _id: ObjectId,
    aid: number,
    email: string,
    nickName: string,
    avatar?: string,
    registeredAt?: Date,
    roles: [ObjectId],
    sex?: ObjectId,
    birthday?: Date,
}