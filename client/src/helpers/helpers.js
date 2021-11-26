import { format, formatDistance, parseISO } from 'date-fns'

export const calculateTimeAgo = (date) => {
	return formatDistance(parseISO(date), new Date(), { addSuffix: true })
}

export const formatDate = (date) => {
	return format(parseISO(date), 'EEEE d MMMM y, H:mm', {
		weekStartsOn : 1
	})
}
