import {
	format,
	formatDistance,
	parseISO,
	formatDuration,
	differenceInSeconds,
	differenceInHours,
	intervalToDuration
} from 'date-fns'

export const calculateTimeAgo = (date) => {
	return formatDistance(parseISO(date), new Date(), { addSuffix: true })
}

export const formatDate = (date) => {
	return format(parseISO(date), 'EEEE d MMMM y, H:mm', {
		weekStartsOn : 1
	})
}

export const shouldRefreshTimer = (endDate) => {
	const diffSec = differenceInSeconds(new Date(endDate), new Date())
	if (diffSec <= 600 && diffSec >= 0) {
		return true
	} else return false
}

export const formatAuctionDuration = (endDate) => {
	const timer = intervalToDuration({
		start : new Date(),
		end   : new Date(endDate)
	})

	if (differenceInSeconds(new Date(endDate), new Date()) <= 0) {
		return `expired recently`
	}

	if (differenceInSeconds(new Date(endDate), new Date()) <= 600) {
		return `${formatDuration(timer, { format: [ 'minutes', 'seconds' ] })}`
	} else if (differenceInHours(new Date(endDate), new Date()) <= 12) {
		return `${formatDuration(timer, { format: [ 'hours', 'minutes' ] })} left`
	} else if (differenceInHours(new Date(endDate), new Date()) >= 12) {
		return `${formatDuration(timer, { format: [ 'days', 'hours' ] })} left`
	} else {
		return `${formatDuration(timer, { format: [ 'days', 'hours', 'minutes' ] })} left`
	}
}
