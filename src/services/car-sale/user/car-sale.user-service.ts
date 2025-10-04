import { CarsForSaleDataProvider } from "@/providers";
import { FindCarsForSaleUserServicePayload, FindSpecificCarForSaleUserServicePayload, PostCarForSaleUserServicePayload } from "./car-sale.user-service.models";
import { CarForSaleUserDetailModel, CarForSaleUserListModel } from "@/entities";
import { businessError } from "@/lib/errors";
import { FileSystemProvider } from "@/providers/contracts";
import { v4 } from "uuid";

export class CarSaleUserService {
    public constructor(
        private readonly dataProvider: CarsForSaleDataProvider,
        private readonly fileSystemProvider: FileSystemProvider,
        private readonly userId: string
    ) {

    }

    public findList = async (payload: FindCarsForSaleUserServicePayload): Promise<CarForSaleUserListModel[]> => {
        const result = await this.dataProvider.list({
            userId: this.userId,
            status: payload.status
        }, {
            pageSize: payload.pageSize,
            zeroBasedIndex: payload.zeroBasedIndex
        })

        return result.map((x) => {
            return {
                id: x.id,
                licencePlate: x.licencePlate,
                status: x.status,
            }
        })
    }

    public details = async (payload: FindSpecificCarForSaleUserServicePayload): Promise<CarForSaleUserDetailModel> => {
        const result = await this.dataProvider.details({
            id: payload.id,
            userId: this.userId
        })

        if (!result) {
            throw businessError('No according car for sale was found', undefined, 404)
        }

        const photoLink = await this.fileSystemProvider.obtainDownloadLink(result.photoId)

        return {
            id: result.id,
            licencePlate: result.licencePlate,
            mileage: result.mileage,
            photoLink: photoLink!,
            status: result.status
        }
    }

    public post = async (payload: PostCarForSaleUserServicePayload) => {
        const photoId = `${v4()}-${payload.photo.name}`;
        await this.fileSystemProvider.upload(payload.photo, photoId, payload.photo.name)

        await this.dataProvider.create({
            licencePlate: payload.licencePlate,
            mileage: payload.mileage,
            photoId: photoId,
            userId: this.userId
        })
    }
}