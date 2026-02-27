'use client'

import CustomersViewPage from "@/components/pages/customers/view";
import { useUserInfo } from "@/hooks/useUserInfo";
import { UserRole } from "@/types/model";

const Page = () => {
    const user = useUserInfo();
    if (!user) {
        return null;
    }
    return (
        <CustomersViewPage role={UserRole.SALE} query={{ saleId: user.id }} />
    );
};

export default Page;