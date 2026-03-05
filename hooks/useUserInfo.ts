import { useEffect, useState } from "react";
import { User } from "@/types/model";

export const useUserInfo = () => {
    const [user, setUser] = useState<User & {token: string} | null>(null);
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);
    return user;
}