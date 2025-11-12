import {UserNotificationsViews} from "../../user-notifications.feature.container";
import styles from './list.module.css'
import {ScrollArea, Stack} from "@mantine/core";

export const List: UserNotificationsViews['List'] = ({children}) => {
    return <div>
        <ScrollArea>
            <Stack gap="sx">
                {children}
            </Stack>
        </ScrollArea>
    </div>
}