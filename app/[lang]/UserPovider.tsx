"use client"

import React, { createContext, useState } from 'react';

interface User{
    id: number;
    nickName: string | null;
    registerDate: Date;
    avatar: string | null;
    birthday: Date | null;
}

interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps>({
    user: null,
    setUser: () => {},
});

const UserProvider: React.FC<{ children: React.ReactNode, v: User | null }> = ({ children, v }) => {
    const [user, setUser] = useState<User | null>(v);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;