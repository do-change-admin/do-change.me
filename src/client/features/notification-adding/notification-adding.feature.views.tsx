// import { FeatureViews } from "@/client/utils/views.utils";
// import type { NotificationAddingFeatureContainer } from "./notification-adding.feature.container";
// import { Button, Input, Select } from "@mantine/core";
// import { NotificationLevel } from "@/value-objects/notification.value-object";

// export const notificationAddingFeatureViews: FeatureViews<typeof NotificationAddingFeatureContainer> = {
//     AddNotificationButton: ({ add, disabled }) => {
//         return <Button disabled={disabled} onClick={async () => {
//             try {
//                 await add()
//                 alert("Notification was succesfully added")
//             } catch (e) {
//                 console.log(e)
//             }
//         }}>Add notification</Button>
//     },

//     Container: ({ children }) => {
//         return <>{children}</>
//     },

//     FormLayout: ({ addNotificationButton, levelSelector, messageControl, titleControl, userSelector }) => {
//         return <div>
//             <div>UserID: {userSelector}</div>
//             <div>Title: {titleControl}</div>
//             <div>Message: {messageControl}</div>
//             <div>Level: {levelSelector}</div>
//             <div>
//                 {addNotificationButton}
//             </div>
//         </div>
//     },

//     Loader: () => <div>Loading...</div>,

//     LevelSelector: ({ levelState }) => {
//         const [level, setLevel] = levelState

//         return <Select value={level} data={['error', 'info', 'warning'] as NotificationLevel[]} onChange={(x) => {
//             if (!!x) {
//                 setLevel(x as NotificationLevel)
//             }
//         }} />
//     },

//     MessageSelector: ({ messageState }) => {
//         const [message, setMessage] = messageState;

//         return <Input value={message} onChange={(x) => { setMessage(x.target.value) }} />
//     },

//     TitleSelector: ({ titleState }) => {
//         const [title, setTitle] = titleState

//         return <Input value={title} onChange={(x) => { setTitle(x.target.value) }} />
//     },

//     UserSelector: ({ userIdState }) => {
//         const [userId, setUserId] = userIdState

//         return <Input value={userId} onChange={(x) => { setUserId(x.target.value) }} />
//     },
// }