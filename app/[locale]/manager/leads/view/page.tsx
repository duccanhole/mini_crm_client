import LeadsViewDetail from "@/components/pages/leads/detail";
import { UserRole } from "@/types/model";

export default function LeadsViewDetailPage() {
    return (
        <LeadsViewDetail role={UserRole.MANAGER} />
    )
}