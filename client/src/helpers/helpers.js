import {
	format,
	formatDistanceToNow,
	parseISO,
	formatDistanceToNowStrict,
	differenceInHours,
	differenceInDays,
	differenceInMinutes
} from 'date-fns'

export const calculateTimeAgo = (date) => {
	return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

export const calculateTimeAgoStrict = (date) => {
	return formatDistanceToNowStrict(parseISO(date), { addSuffix: true })
}

export const formatDate = (date) => {
	return format(parseISO(date), 'EEEE d MMMM y, H:mm', {
		weekStartsOn : 1
	})
}

export const formatDateSimple = (date) => {
	return format(parseISO(date), 'd MMMM y', {
		weekStartsOn : 1
	})
}

export const dateDiff = (date, type) => {
	if (type === 'm') {
		return differenceInMinutes(new Date(date), new Date())
	} else if (type === 'h') {
		return differenceInHours(new Date(date), new Date())
	} else if (type === 'd') {
		return differenceInDays(new Date(date), new Date())
	}
}
