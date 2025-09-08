import { FC, useState } from "react";
import styles from './MileageButtons.module.css'
import { Range, meanNumericRangeValue, rangeAsString } from "./utils";
import cn from "classnames";


export type MileageButtonsProps = {
    onMileageChange: (mileageValue: number) => void;
    values?: Range[];
    averageMileage: number
}

const DEFAULT_VALUES: Range[] = [
    { down: 0, up: 50 },
    { down: 50, up: 100 },
    { down: 100, up: 150 },
    { down: 150, up: undefined },
]

export const MileageButtons: FC<MileageButtonsProps> = ({ onMileageChange, values, averageMileage }) => {
    const [selected, setSelected] = useState<string>('0-50k')

    const actualValues = (values ?? DEFAULT_VALUES).sort((a, b) => a.down - b.down)
    return <div className={styles.mileageRange}>
        <h3 className={styles.label}>Mileage Range</h3>
        <div className={styles.mileageButtons}>
            {actualValues.map((range) => {
                const stringRepresentation = rangeAsString(range, 'k')
                const isSelected = stringRepresentation == selected
                const meanValue = meanNumericRangeValue(range)
                return (
                    <button
                        className={cn({[styles.selected] : isSelected})}
                        onClick={() => { onMileageChange(meanValue); setSelected(stringRepresentation); }}
                        key={stringRepresentation}
                    >
                        {stringRepresentation}
                    </button>
                )
            })}
        </div>
    </div>

}