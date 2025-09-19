import { Schedule } from "@/components/_admin/SchedulePicker/SchedulePicker"
import dayjs from "dayjs"

export const useDatesMapping = () => {
    const scheduleFromDates = (dates: Date[]) => {
        const newData: Record<string, string[]> = {}
        dates.forEach(x => {
            const currentDate = dayjs(x)
            const day = currentDate.get('D')
            const month = currentDate.get('M')
            const year = currentDate.get('y')
            const hour = currentDate.get('h')
            const date = new Date(year, month, day)
            const dateAsString = dayjs(date).format('YYYY-MM-DD')
            if (!newData[dateAsString]) {
                newData[dateAsString] = []
            }
            newData[dateAsString] = [...newData[dateAsString], hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`]
        })
        return newData as Schedule
    }

    const datesFromSchedule = (schedule: Schedule) => {
        return Object.entries(schedule).flatMap(([dateAsString, times]) => {
            const rootDate = dayjs(dateAsString)
            const withTime = times.map(time => {
                return rootDate.set('h', time.split(' ')[1].toLowerCase() === 'am' ? +time.split(' ')[0].split(':')[0] : +time.split(' ')[0].split(':')[0] + 12)
            })
            return withTime.map(x => x.toDate())
        })
    }

    return { scheduleFromDates, datesFromSchedule }
}