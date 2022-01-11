import store from '../store'
import queryString from 'query-string'
import { axsPUBLIC, axsAUTH, multipartAxsAUTH } from './axs'

export const apiFetchKickstarters = async () => {
	const { data } = await axsPUBLIC.get('/api/misc/kickstarters')
	return data
}

export const apiFetchRedditPosts = async () => {
	const { data } = await axsPUBLIC.get('https://www.reddit.com/r/boardgames/.json?limit=10')
	const { data: { children } } = data
	return children
}

export const apiGetNotifications = async () => {
	const { data } = await axsAUTH.get('/api/users/notifications')
	return data
}

export const apiUserChangePassword = async ({ passwordCurrent, passwordNew, passwordNewConfirmation }) => {
	await axsAUTH.post('/api/users/password', { passwordCurrent, passwordNew, passwordNewConfirmation })
}

export const apiUserChangeAvatar = async (img) => {
	const { data } = await axsAUTH.post('/api/users/avatar', img)
	return data
}

export const fetchGames = async ({ search, page, sort, mode }) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1,
			sort   : sort ? sort : 'new',
			mode
		}
	}
	const { data } = await axsAUTH.get('/api/games', config)

	return data
}

export const apiGetSentMessages = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/messages/sent', config)
	return data
}

export const apiGetReceivedMessages = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/messages/received', config)
	return data
}

export const apiUpdateMessageStatus = async (id) => {
	return await axsAUTH.patch(`/api/messages/update/${id}`, {})
}

export const apiGetNewMessagesCount = async () => {
	const { data } = await axsAUTH.get('/api/messages/new/count')
	return data
}

export const apiDeleteMessages = async (ids, type) => {
	const config = {
		params           : {
			type,
			ids
		},
		paramsSerializer : (params) => queryString.stringify(params, { arrayFormat: 'bracket' })
	}
	return await axsAUTH.delete('/api/messages/delete', config)
}

export const apiFetchOwnedCollection = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/collections/owned', config)
	return data
}

export const apiFetchWantedGames = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/games/wanted', config)
	return data
}

export const apiFetchWishlistCollection = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/collections/wishlist', config)
	return data
}

export const apiFetchSingleGame = async (altId) => {
	const { data } = await axsAUTH.get(`/api/games/${altId}`)
	return data
}

export const apiFetchSavedGames = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/games/saved', config)
	return data
}

export const apiFetchGameSavedStatus = async (altId) => {
	const { data } = await axsAUTH.get(`/api/games/${altId}/save`)
	return data
}

export const apiUpdateSavedGameStatus = async (altId) => {
	const { data } = await axsAUTH.patch(`/api/games/${altId}/save`, {})
	return data
}

export const apiFetchGallery = async (bggIds) => {
	const config = {
		params           : {
			bggIds
		},
		paramsSerializer : (params) => queryString.stringify(params, { arrayFormat: 'bracket' })
	}

	const { data } = await axsAUTH.get('/api/misc/bgg/gallery', config)
	return data
}

export const apiFetchGamesHistory = async ({ search, page, mode }) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1,
			mode
		}
	}

	const { data } = await axsAUTH.get('/api/history', config)
	return data
}

export const apiSendMessage = async (subject, message, recipient) => {
	return await axsAUTH.post('/api/messages', { subject, message, recipient })
}

export const apiFetchBggCollection = async (bggUsername) => {
	return await axsAUTH.post('/api/collections', { bggUsername })
}

export const apiBggSearchGames = async (search) => {
	const config = {
		params : {
			search : search ? search.trim() : null
		}
	}

	const { data } = await axsAUTH.get('/api/misc/bgg/search', config)
	return data
}

export const apiFetchListedGames = async (search, page) => {
	const { userAuth: { userData } } = store.getState()
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get(`/api/games/user/${userData._id}`, config)
	return data
}

export const apiAddSoldGamesToHistory = async (gamesData) => {
	return await axsAUTH.post('/api/history/sell', gamesData)
}

export const apiAddTradedGamesToHistory = async (gamesData) => {
	return await axsAUTH.post('/api/history/trade', gamesData)
}

export const apiAddBoughtGamesToHistory = async (gamesData) => {
	return await axsAUTH.post('/api/history/buy', gamesData)
}

export const apiDeleteListedGame = async (id) => {
	return await axsAUTH.delete(`/api/games/${id}/delete`)
}

export const apiReactivateListedGame = async (id) => {
	return await axsAUTH.patch(`/api/games/${id}/reactivate`, {})
}

export const apiFetchHotGames = async () => {
	const { data } = await axsPUBLIC.get('/api/misc/bgg/hot')
	return data
}

export const apiFetchGameDetails = async (bggIds) => {
	const config = {
		params           : {
			bggIds
		},
		paramsSerializer : (params) => queryString.stringify(params, { arrayFormat: 'bracket' })
	}

	const { data } = await axsAUTH.get('/api/misc/bgg/games', config)
	return data
}

export const apiListGamesForTrade = async (gamesData) => {
	return await axsAUTH.post('/api/games/trade', gamesData)
}

export const apiListGamesForSale = async (gamesData) => {
	return await axsAUTH.post('/api/games/sell', gamesData)
}

export const apiAddWantedGames = async (gamesData) => {
	return await axsAUTH.post('/api/games/wanted', gamesData)
}

export const apiGetProfileData = async (username) => {
	const { data } = await axsAUTH.get(`/api/users/${username}`)
	return data
}
