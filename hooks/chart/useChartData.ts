import { useCountCustomers } from "../api/useCustomer";
import { useCountLeads, useValueLeads } from "../api/useLead";
import dayjs from "dayjs";
import { LeadStatus } from "@/types/model";

export default function useChartData() {
    const { data: countCustomersThisMonth, refetch: refetchCountCustomersThisMonth } = useCountCustomers({
        createdFrom: dayjs().startOf('month').toISOString(),
        createdTo: dayjs().endOf('month').toISOString()
    })
    const { data: countCustomersLastMonth, refetch: refetchCountCustomersLastMonth } = useCountCustomers({
        createdFrom: dayjs().subtract(1, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(1, 'month').endOf('month').toISOString()
    })
    const { data: countCustomersLast2Month, refetch: refetchCountCustomersLast2Month } = useCountCustomers({
        createdFrom: dayjs().subtract(2, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(2, 'month').endOf('month').toISOString()
    })

    const { data: countLeadsTotalThisMonth, refetch: refetchCountLeadsTotalThisMonth } = useCountLeads({
        createdFrom: dayjs().startOf('month').toISOString(),
        createdTo: dayjs().endOf('month').toISOString()
    })

    const { data: countLeadsTotalLastMonth, refetch: refetchCountLeadsTotalLastMonth } = useCountLeads({
        createdFrom: dayjs().subtract(1, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(1, 'month').endOf('month').toISOString()
    })

    const { data: countLeadsTotalLast2Month, refetch: refetchCountLeadsTotalLast2Month } = useCountLeads({
        createdFrom: dayjs().subtract(2, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(2, 'month').endOf('month').toISOString()
    })

    const { data: countLeadsWinThisMonth, refetch: refetchCountLeadsWinThisMonth } = useCountLeads({
        createdFrom: dayjs().startOf('month').toISOString(),
        createdTo: dayjs().endOf('month').toISOString(),
        status: LeadStatus.WON
    })

    const { data: countLeadsWinLastMonth, refetch: refetchCountLeadsWinLastMonth } = useCountLeads({
        createdFrom: dayjs().subtract(1, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(1, 'month').endOf('month').toISOString(),
        status: LeadStatus.WON
    })

    const { data: countLeadsWinLast2Month, refetch: refetchCountLeadsWinLast2Month } = useCountLeads({
        createdFrom: dayjs().subtract(2, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(2, 'month').endOf('month').toISOString(),
        status: LeadStatus.WON
    })

    const { data: countLeadsLostThisMonth, refetch: refetchCountLeadsLostThisMonth } = useCountLeads({
        createdFrom: dayjs().startOf('month').toISOString(),
        createdTo: dayjs().endOf('month').toISOString(),
        status: LeadStatus.LOST
    })

    const { data: countLeadsLostLastMonth, refetch: refetchCountLeadsLostLastMonth } = useCountLeads({
        createdFrom: dayjs().subtract(1, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(1, 'month').endOf('month').toISOString(),
        status: LeadStatus.LOST
    })

    const { data: countLeadsLostLast2Month, refetch: refetchCountLeadsLostLast2Month } = useCountLeads({
        createdFrom: dayjs().subtract(2, 'month').startOf('month').toISOString(),
        createdTo: dayjs().subtract(2, 'month').endOf('month').toISOString(),
        status: LeadStatus.LOST
    })

    const refresh = () => {
        refetchCountCustomersThisMonth();
        refetchCountCustomersLastMonth();
        refetchCountCustomersLast2Month();
        refetchCountLeadsTotalThisMonth();
        refetchCountLeadsTotalLastMonth();
        refetchCountLeadsTotalLast2Month();
        refetchCountLeadsWinThisMonth();
        refetchCountLeadsWinLastMonth();
        refetchCountLeadsWinLast2Month();
        refetchCountLeadsLostThisMonth();
        refetchCountLeadsLostLastMonth();
        refetchCountLeadsLostLast2Month();
    }

    return {
        data: {
            customers: {
                thisMonth: countCustomersThisMonth?.data ?? 0,
                lastMonth: countCustomersLastMonth?.data ?? 0,
                last2Month: countCustomersLast2Month?.data ?? 0
            },
            leads: {
                total: {
                    thisMonth: countLeadsTotalThisMonth?.data ?? 0,
                    lastMonth: countLeadsTotalLastMonth?.data ?? 0,
                    last2Month: countLeadsTotalLast2Month?.data ?? 0
                },
                won: {
                    thisMonth: countLeadsWinThisMonth?.data ?? 0,
                    lastMonth: countLeadsWinLastMonth?.data ?? 0,
                    last2Month: countLeadsWinLast2Month?.data ?? 0
                },
                lost: {
                    thisMonth: countLeadsLostThisMonth?.data ?? 0,
                    lastMonth: countLeadsLostLastMonth?.data ?? 0,
                    last2Month: countLeadsLostLast2Month?.data ?? 0
                }
            }
        },
        refresh
    }
}