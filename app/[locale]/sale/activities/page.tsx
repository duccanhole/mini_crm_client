'use client'

import ActivitiesViewPage from "@/components/pages/activities/view"
import { useUserInfo } from "@/hooks/useUserInfo"

const ActivitiesPage = () => {
    const user = useUserInfo();
    if (!user) {
        return null; // Or a loading spinner if preferred
    }

    return (
        <ActivitiesViewPage query={{
            createdById: user?.id
        }} />
    )
}

export default ActivitiesPage
