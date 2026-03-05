import NotificationsViewPage from "@/components/pages/notifications/view";
import { UserRole } from "@/types/model";

const Page = () => {
    return (
        <NotificationsViewPage role={UserRole.ADMIN} />
    );
};

export default Page;
