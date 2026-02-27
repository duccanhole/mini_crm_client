import CustomersViewPage from "@/components/pages/customers/view";
import { UserRole } from "@/types/model";

const Page = () => {
    return (
        <CustomersViewPage role={UserRole.ADMIN} />
    );
};

export default Page;