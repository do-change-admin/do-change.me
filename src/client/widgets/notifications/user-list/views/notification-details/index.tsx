import { UserNotificationDetailsProps } from "@/client/features/notifications/user";
import { Modal } from "@mantine/core";

export const NotificationDetails: UserNotificationDetailsProps['views']['NotificationDetails'] = ({
    clearSelectedItem,
    currentItem,
    seen
}) => {
    return <Modal 
        opened 
        zIndex={99999999999} 
        title={<h3>{currentItem.title}</h3>}
        centered
        radius='lg'
        onClose={() => {
            if (!seen.status) {
                seen.read()
            }
            clearSelectedItem()
        }}
    >
            {currentItem.message}
    </Modal>

}