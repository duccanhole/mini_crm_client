'use client'

import ActivitiesViewPage from "@/components/pages/activities/view"
import { useGetUsers } from "@/hooks/api/useUser";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchQueryParams } from "@/types/api";
import { UserRole } from "@/types/model";
import { Flex, Select, Space, theme } from "antd"
import { useTranslations } from "next-intl";
import { useState } from "react";

const { Option } = Select;

const ActivitiesPage = () => {
    const { token } = theme.useToken();
    const tCommon = useTranslations('common');
    const tLeadsPage = useTranslations('LeadsPage');
    const [queryParams, setQueryParams] = useState<SearchQueryParams>({

    });
    const [userSearch, setUserSearch] = useState('');
    const debouncedUserSearch = useDebounce(userSearch, 500);
    const { data: usersResponse, isLoading: isFetchingUsers } = useGetUsers({
        size: 100,
        search: debouncedUserSearch,
        role: UserRole.SALE
    });
    return (
        <Flex vertical gap={token.marginLG}>
            <Space>
                <Select
                    showSearch
                    filterOption={false}
                    onSearch={setUserSearch}
                    placeholder={tLeadsPage('assignedTo')}
                    loading={isFetchingUsers}
                    onChange={(value) => {
                        setQueryParams({
                            ...queryParams,
                            createdById: value,
                            page: 0
                        });
                    }}
                    style={{ width: 200 }}
                >
                    {usersResponse?.data?.content?.map((user: any) => (
                        <Option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                        </Option>
                    ))}
                    <Option value={null}>{tCommon('all')}</Option>
                </Select>
            </Space>
            <ActivitiesViewPage query={queryParams} role={UserRole.MANAGER} />
        </Flex>
    )
}

export default ActivitiesPage
