"use client"

import React, { createContext, useEffect, useState } from 'react';
import getUser from './userAction';

interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps>({
    user: null,
    setUser: () => {},
});

const UserProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser().then(setUser);
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;