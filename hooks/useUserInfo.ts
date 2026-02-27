import { useEffect, useState } from "react";

export const useUserInfo = () => {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);
    return user;
}