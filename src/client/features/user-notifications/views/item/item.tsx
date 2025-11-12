import { Badge, Text, Card, Group} from "@mantine/core";
import {FaCheckCircle, FaExclamationTriangle, FaInfo, FaInfoCircle, FaRegCircle, FaTimesCircle} from 'react-icons/fa'
import { UserNotificationsViews } from "../../user-notifications.feature.container";

const ICONS = {
    info: <FaInfoCircle color="var(--cl-fio)" />,
    warning: <FaExclamationTriangle color="var(--cl-secondary)" />,
    error: <FaTimesCircle color="var(--cl-primary)" />,
};

const COLORS = {
    info: "var(--cl-fio)",
    warning:  "var(--cl-secondary)",
    error: "var(--cl-primary)",
};



export const Item: UserNotificationsViews['Item'] = ({ data }) => {
    const { level, message, status, title } = data

    return    <Card
        shadow="md"
        radius="lg"
        padding="lg"
        withBorder
        onClick={() => status.open()}
        style={{
            borderColor:  status.seen ? "#ccc8c8" : COLORS[level],
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
        <Group justify="space-between" mb="xs">
            <Group>
                {ICONS[level]}
                <Text fw={600} c={COLORS[level]}>{title}</Text>
            </Group>
            <Badge
                variant={status.seen ? "light" : "filled"}
                color={status.seen ? "gray" : "green"}
                leftSection={  status.seen ? (
                    <FaCheckCircle size={12} style={{ marginRight: 4 }} />
                ) : (
                    <FaRegCircle size={12} style={{ marginRight: 4 }} />
                )}
            >
                {status.seen ? "Read" : "Unread"}
            </Badge>
        </Group>

        <Text
            size="sm"
            c="dimmed"
            style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
        >
            {message}
        </Text>
    </Card>
}