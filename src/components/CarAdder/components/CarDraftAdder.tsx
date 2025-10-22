import React, { useEffect, useState } from "react";
import { CarFormAdder, CarInfo, CarPhoto } from "./CarFormAdder";
import { Queries } from "@/hooks";

export interface CarDraftAdderProps {
    opened: boolean;
    draftId: string;
    onClose: () => void;
}

export const CarDraftAdder: React.FC<CarDraftAdderProps> = ({
    draftId,
    onClose,
    ...rest
}) => {
    const [vin, setVin] = useState("");

    const { data: draft, isLoading } = Queries.SyndicationRequestDrafts.useDetails(draftId);
    const { mutateAsync: updateDraft } = Queries.SyndicationRequestDrafts.useUpdate();
    const { mutateAsync: postNewCar } = Queries.SyndicationRequests.usePostingFromDraft();

    useEffect(() => {
        if (draft) {
            setVin(draft.vin ?? "");
        }
    }, [draft?.id]);

    const getRemovedPhotos = (photos: CarPhoto[]) => {
        if (!draft?.currentPhotos) return [];

        const currentIds = photos
            .filter((p) => p.type === "remote")
            .map((p) => p.url);

        return draft.currentPhotos
            .filter((p) => !currentIds.includes(p.id))
            .map((p) => p.id);
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
            photos: values.photos
                .filter((p) => p.type === "local")
                .map((p) => p.file),
            photoIdsToBeRemoved: getRemovedPhotos(values.photos),
        });
        onClose();
    };

    const handleSubmitForSyndication = async (values: Required<CarInfo>) => {
        await handleUpdateDraft(values)
        await postNewCar({ query: { draftId } })

        onClose();
    };

    if (isLoading || !draft) return null;

    const remotePhotos: CarPhoto[] = draft.currentPhotos
        ? draft.currentPhotos.map((photo) => ({
            type: "remote",
            url: photo.url,
            id: photo.id,
        }))
        : [];

    return (
        <CarFormAdder
            mode="draft"
            onClose={onClose}
            onDraft={handleUpdateDraft}
            onSubmitForSyndication={handleSubmitForSyndication}
            vin={vin}
            setVin={setVin}
            initialCarInfo={{
                photos: remotePhotos,
                make: draft.make,
                mileage: draft.mileage,
                model: draft.model,
                price: draft.price,
                year: draft.year,
            }}
            {...rest}
        />
    );
};
