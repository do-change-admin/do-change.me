import { UserNotificationsListProps } from "@/client/features/notifications/user";
import { Box, LoadingOverlay, ScrollArea, Stack } from "@mantine/core";

export const NotificationsLayout: UserNotificationsListProps['views']['Layout'] = ({
    notificationsMarkup,
    fetchingStatus
}) => {
    return <Box pos='relative'>
        <LoadingOverlay visible={fetchingStatus === 'pending'} />
        <ScrollArea>
            <Stack gap="sx">
                {notificationsMarkup}
            </Stack>
        </ScrollArea>
    </Box>
}