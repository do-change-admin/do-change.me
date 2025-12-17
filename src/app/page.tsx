'use client';

import { useDisclosure } from '@mantine/hooks';
import { SearchSection, SubscriptionPlans } from '@/client/components';
import styles from './page.module.css';

export default function Reports() {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <div className={styles.main} id="main-content">
            <SubscriptionPlans close={close} opened={opened} />
            <SearchSection openSubscription={open} />
        </div>
    );
}
