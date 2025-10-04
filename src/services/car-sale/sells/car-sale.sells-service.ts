import { CarsForSaleDataProvider } from "@/providers";
import { FindCarsForSaleSellsServicePayload, FindSpecificCarForSaleSellsServicePayload, SetCarSaleStatusSellsServicePayload } from "./car-sale.sells-service.models";
import { CarForSaleSellsDetailModel, CarForSaleSellsListModel } from "@/entities";
import { businessError } from "@/lib/errors";
import { FileSystemProvider } from "@/providers/contracts";

export class CarSaleSellsService {
    public constructor(
        private readonly dataProvider: CarsForSaleDataProvider,
        private readonly fileSystemProvider: FileSystemProvider
    ) { }

    list = async (payload: FindCarsForSaleSellsServicePayload): Promise<CarForSaleSellsListModel[]> => {
        const items = await this.dataProvider.list({
            status: payload.status,
            userId: payload.userId
        }, {
            pageSize: payload.pageSize,
            zeroBasedIndex: payload.zeroBasedIndex
        })

        return items.map(x => {
            return {
                id: x.id,
                licencePlate: x.licencePlate,
                status: x.status,
                userMail: x.userMail,
                userId: x.userId
            }
        })
    }

    details = async (payload: FindSpecificCarForSaleSellsServicePayload): Promise<CarForSaleSellsDetailModel> => {
        const details = await this.dataProvider.details({
            id: payload.id,
            userId: payload.userId
        })

        if (!details) {
            throw businessError('No according car for sale was found!', undefined, 404)
        }

        const photoLink = await this.fileSystemProvider.obtainDownloadLink(details.photoId)

        return {
            id: details.id,
            licencePlate: details.licencePlate,
            mileage: details.mileage,
            photoLink: photoLink!,
            status: details.status,
            userId: details.userId,
            userMail: details.userMail
        }
    }

    setStatus = async (payload: SetCarSaleStatusSellsServicePayload) => {
        await this.dataProvider.updateOne({
            id: payload.carId,
            userId: payload.userId
        }, {
            status: payload.newStatus
        })
    }
}