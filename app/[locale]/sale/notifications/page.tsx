import NotificationsViewPage from "@/components/pages/notifications/view";
import { UserRole } from "@/types/model";

const Page = () => {
    return (
        <NotificationsViewPage role={UserRole.SALE} />
    );
};

export default Page;
