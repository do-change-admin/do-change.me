import { useQuery } from '@tanstack/react-query';
import type { AdminUsersAPI } from '@/app/api/admin/users/route';
import { apiRequest } from '@/client/utils/api-request.utils';

export const useAdminUsersInfo = () => {
    return useQuery<AdminUsersAPI['GET']['response'], AdminUsersAPI['GET']['error']>({
        queryKey: ['admin-dashboard-info'],
        queryFn: () => {
            return apiRequest('/api/admin/users', 'GET')({});
        }
    });
};
