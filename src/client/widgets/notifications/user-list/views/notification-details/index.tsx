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
        title={<h3>{currentItem.level}: {currentItem.title}</h3>} 
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