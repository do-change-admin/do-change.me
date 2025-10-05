'use client'

import { Input } from "@/components"
import { useCarForSaleUserPosting } from "@/hooks/_car-sale.user.hooks"
import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from './page.module.css'
import { FaPhotoFilm } from "react-icons/fa6"
import { FaCloudUploadAlt } from "react-icons/fa"

export default function () {
    const { mutate: postNewCar } = useCarForSaleUserPosting()
    const [mileage, setMileage] = useState('')
    const [licencePlate, setLicencePlate] = useState('')
    const [photo, setPhoto] = useState<File>()
    const router = useRouter()

    return <div>
        <Input type='string' value={licencePlate} onChange={(x) => {
            setLicencePlate(x.target.value)
        }} placeholder="Provide license plate" />
        <Input type='number' value={mileage} onChange={(x) => {
            setMileage(x.target.value)
        }} placeholder="Provide mileage" />

        <div className={styles.formGroup}>
            <label>
                <FaPhotoFilm className={styles.iconPurple} /> Car photo
            </label>
            <label className={styles.uploadZone} htmlFor="license_upload">
                {photo ? <></> : <FaCloudUploadAlt size={40} className={styles.iconGray} />}
                <div>
                    <p>{photo ? 'You successfully uploaded car photo, click to change picture' : 'Click to upload or drag and drop'}</p>
                </div>
                <input id="license_upload" type="file" onChange={(e) => {
                    const targetFile = e.target.files?.[0]
                    if (!targetFile) {
                        return;
                    }
                    setPhoto(targetFile)
                }} accept=".png,.jpg,.jpeg,.pdf" />
            </label>
        </div>
        <Button
            disabled={!photo || !mileage || !licencePlate}
            onClick={() => {
                // @ts-expect-error all fields must be here
                postNewCar({}, {
                    onSuccess: () => {
                        router.push('/car-sale')
                    }
                })
            }}>Post this car</Button>
    </div>
}