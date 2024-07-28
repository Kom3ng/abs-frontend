"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyToken } from "./verify";
import { Dict } from "../../dictionaries";

export default function RegisterVerifyMain({ dict }: { dict: Dict }) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [verifyState, setVerifyState] = useState<'pending' | 'success' | 'failed'>('pending');

    if (token === null){
        return <h1 className="m-16">{dict.registerPage?.verify?.noToken}</h1>
    }

    useEffect(() => {
        verifyToken(token)
            .then(r => {
                if (r){
                    setVerifyState('success');
                } else {
                    setVerifyState('failed');
                }
            })
    }, [token]);

    if (verifyState === 'pending'){
        return <h1 className="m-16">{dict.registerPage?.verify?.pending}</h1>
    }

    if (verifyState === 'success'){
        return <h1 className="m-16 text-green-500">{dict.registerPage?.verify?.success}</h1>
    }

    if (verifyState === 'failed'){
        return <h1 className="m-16 text-red-500">{dict.registerPage?.verify?.failed}</h1>
    }
}