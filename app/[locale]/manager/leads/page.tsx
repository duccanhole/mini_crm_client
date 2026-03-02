import LeadsDashboard from "@/components/pages/leads/dashboard";
import { UserRole } from "@/types/model";

export default function MyLeadsPage() {
    return (
        <LeadsDashboard role={UserRole.MANAGER} />
    );
}