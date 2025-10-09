import { AdminUsersAPI } from "@/app/api/admin/users/route"
import { apiRequest } from "@/lib/apiFetch"
import { useQuery } from "@tanstack/react-query"

export const useAdminUsersInfo = () => {
    return useQuery<AdminUsersAPI['GET']['response'], AdminUsersAPI['GET']['error']>({
        queryKey: ['admin-dashboard-info'],
        queryFn: () => {
            return apiRequest('/api/admin/users', 'GET')({})
        }
    })
}