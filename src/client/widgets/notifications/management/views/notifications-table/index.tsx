import { AdminNotificationsListProps } from "@/client/features/notifications/management";
import { Box, LoadingOverlay, Table } from "@mantine/core";

export const NotificationsListLayout: AdminNotificationsListProps['views']['Layout'] = ({
    notificationsMarkup,
    status
}) => {
    return <Box pos='relative'>
        <LoadingOverlay visible={status === 'pending'} />
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Td>User ID</Table.Td>
                    <Table.Td>Title</Table.Td>
                    <Table.Td>Message</Table.Td>
                    <Table.Td>Seen</Table.Td>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {notificationsMarkup}
            </Table.Tbody>
        </Table>
    </Box>
}