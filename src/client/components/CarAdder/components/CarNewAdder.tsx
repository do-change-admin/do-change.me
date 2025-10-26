import React, { useState } from "react";
import { CarFormAdder, CarInfo } from "./CarFormAdder";
import {
    useBaseInfoByVIN,
} from "@/client/hooks";
import { useSyndicationRequestDraftCreation } from "@/client/queries/syndication-request-drafts.queries";
import { useSyndicationRequestManualPosting } from "@/client/queries/syndication-requests.queries";

export interface CarNewAdderProps {
    opened: boolean;
    onClose: () => void;
}

export const CarNewAdder: React.FC<CarNewAdderProps> = ({
    onClose,
    ...rest
}) => {
    const [vin, setVin] = useState("");

    const { data: baseInfo } = useBaseInfoByVIN(vin);
    const { mutateAsync: createDraft } = useSyndicationRequestDraftCreation();
    const { mutateAsync: postNewCar } = useSyndicationRequestManualPosting();

    const handleCreateDraft = async (values: CarInfo) => {
        await createDraft({
            vin,
            make: values.make,
            model: values.model,
            year: values.year,
            mileage: values.mileage,
            price: values.price,
            photos: values.photos
                .filter((p) => p.type === "local")
                .map((p) => p.file),
        });
        onClose();
    };

    const handleSubmitForSyndication = async (values: Required<CarInfo>) => {
        await postNewCar({
            make: values.make,
            mileage: values.mileage,
            model: values.model,
            photos: values.photos
                .filter((photo) => photo.type === "local")
                .map((photo) => photo.file),
            price: values.price,
            vin: vin,
            year: values.year,
        });

        onClose();
    };

    return (
        <CarFormAdder
            mode="new"
            onClose={onClose}
            setVin={setVin}
            vin={vin}
            initialCarInfo={{
                photos: [],
                make: baseInfo?.Make,
                model: baseInfo?.Model,
                year: baseInfo?.ModelYear
                    ? Number(baseInfo?.ModelYear)
                    : undefined,
            }}
            onDraft={handleCreateDraft}
            onSubmitForSyndication={handleSubmitForSyndication}
            {...rest}
        />
    );
};
