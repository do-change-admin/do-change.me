import type React from 'react';
import { useEffect, useState } from 'react';
import {
    useSyndicationRequestDraftDetails,
    useSyndicationRequestDraftUpdate
} from '@/client/queries/syndication-request-drafts.queries';
import { useSyndicationRequestPostingFromDraft } from '@/client/queries/syndication-requests.queries';
import { CarFormAdder, type CarInfo, type CarPhoto } from './CarFormAdder';

export interface CarDraftAdderProps {
    opened: boolean;
    draftId: string;
    onClose: () => void;
}

export const CarDraftAdder: React.FC<CarDraftAdderProps> = ({ draftId, onClose, ...rest }) => {
    const [vin, setVin] = useState('');

    const { data: draft, isLoading } = useSyndicationRequestDraftDetails(draftId);
    const { mutateAsync: updateDraft } = useSyndicationRequestDraftUpdate();
    const { mutateAsync: postNewCar } = useSyndicationRequestPostingFromDraft();

    useEffect(() => {
        if (draft) {
            setVin(draft.vin ?? '');
        }
    }, [draft?.id]);

    const getRemovedPhotos = (photos: CarPhoto[]) => {
        if (!draft?.currentPhotos) return [];

        const currentIds = photos.filter((p) => p.type === 'remote').map((p) => p.id);

        return draft.currentPhotos.filter((p) => !currentIds.includes(p.id)).map((p) => p.id);
    };

    const handleUpdateDraft = async (values: CarInfo) => {
        await updateDraft({
            vin,
            make: values.make,
            model: values.model,
            year: values.year,
            mileage: values.mileage,
            price: values.price,
            id: draftId,
            photos: values.photos.filter((p) => p.type === 'local').map((p) => p.file),
            photoIdsToBeRemoved: getRemovedPhotos(values.photos)
        });
        onClose();
    };

    const handleSubmitForSyndication = async (values: Required<CarInfo>) => {
        await handleUpdateDraft(values);
        await postNewCar({ body: { draftId } });

        onClose();
    };

    if (isLoading || !draft) return null;

    const remotePhotos: CarPhoto[] = draft.currentPhotos
        ? draft.currentPhotos.map((photo) => ({
              type: 'remote',
              url: photo.url,
              id: photo.id
          }))
        : [];

    return (
        <CarFormAdder
            initialCarInfo={{
                photos: remotePhotos,
                make: draft.make,
                mileage: draft.mileage,
                model: draft.model,
                price: draft.price,
                year: draft.year
            }}
            isPending={false}
            mode="draft"
            onClose={onClose}
            onDraft={handleUpdateDraft}
            onSubmitForSyndication={handleSubmitForSyndication}
            setVin={setVin}
            vin={vin}
            {...rest}
        />
    );
};
