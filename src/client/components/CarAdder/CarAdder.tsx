'use client';

import type { FC } from 'react';

import { CarDraftAdder } from './components/CarDraftAdder';
import { CarNewAdder } from './components/CarNewAdder';

interface CarAdderProps {
    opened: boolean;
    onClose: () => void;
    draftId?: string;
}

export const CarAdder: FC<CarAdderProps> = ({ onClose, opened, draftId }) => {
    if (draftId) {
        return <CarDraftAdder draftId={draftId} onClose={onClose} opened={opened} />;
    }

    return <CarNewAdder onClose={onClose} opened={opened} />;
};
