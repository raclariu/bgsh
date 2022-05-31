import queryString from 'query-string'
import { axsPUBLIC, axsAUTH } from './axs'

export const apiActivateAccount = async (tokenUid) => {
	await axsPUBLIC.get(`/api/users/activate/${tokenUid}`)
}

export const apiCreateAccount = async ({ email, username, password, passwordConfirmation }) => {
	await axsPUBLIC.post('/api/users/signup', { email, username, password, passwordConfirmation })
}

export const apiUserLogin = async ({ email, password }) => {
	const { data } = await axsPUBLIC.post('/api/users/login', { email, password })
	return data
}

export const apiGetMe = async () => {
	const { data } = await axsAUTH.get('/api/users/me')
	return data
}

export const apiFetchRedditPosts = async () => {
	const { data } = await axsPUBLIC.get('https://www.reddit.com/r/boardgames/.json', {
		params : {
			limit : 10
		}
	})
	const { data: { children } } = data
	return children
}

export const apiGetNotifications = async () => {
	const { data } = await axsAUTH.get('/api/notifications')
	return data
}

export const apiDeleteOneNotification = async (ntfId) => {
	const { data } = await axsAUTH.delete('/api/notifications', { data: { ntfId } })
	return data
}

export const apiClearAllNotifications = async () => {
	await axsAUTH.delete('/api/notifications/clear')
}

export const apiUserChangePassword = async ({ passwordCurrent, passwordNew, passwordNewConfirmation }) => {
	await axsAUTH.post('/api/users/password/change', { passwordCurrent, passwordNew, passwordNewConfirmation })
}

export const apiForgotPasswordRequest = async (email) => {
	await axsPUBLIC.post('/api/users/password/forgot', { email })
}

export const apiResetPassword = async ({ tokenUid, passwordNew, passwordNewConfirmation }) => {
	await axsPUBLIC.post('/api/users/password/reset', { tokenUid, passwordNew, passwordNewConfirmation })
}

export const apiUserChangeAvatar = async (img) => {
	const { data } = await axsAUTH.post('/api/users/avatar', img)
	return data
}

export const apiGetGamesIndex = async ({ search, page, sort, mode }) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1,
			sort   : sort ? sort : 'updated',
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
	const { data } = await axsAUTH.patch(`/api/messages/update/${id}`, {})
	return data
}

export const apiGetNewMessagesCount = async () => {
	const { data } = await axsAUTH.get('/api/messages/new/count')
	return data
}

export const apiDeleteMessages = async (ids, type) => {
	return await axsAUTH.delete('/api/messages/delete', { data: { ids, type } })
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

export const apiFetchForTradeCollection = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/collections/fortrade', config)
	return data
}

export const apiFetchWantInTradeCollection = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/collections/wantintrade', config)
	return data
}

export const apiFetchWantToBuyCollection = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/collections/wanttobuy', config)
	return data
}

export const apiFetchWantToPlayCollection = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get('/api/collections/wanttoplay', config)
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

export const apiDeleteSavedGame = async (altId) => {
	await axsAUTH.delete(`/api/games/${altId}/save`)
}

export const apiUpdateSavedGameStatus = async (altId) => {
	const { data } = await axsAUTH.patch(`/api/games/${altId}/save`, {})
	return data
}

export const apiFetchGallery = async (bggId) => {
	const config = {
		params : {
			bggId
		}
	}

	const { data } = await axsAUTH.get('/api/misc/bgg/gallery', config)
	return data
}

export const apiFetchRecommendations = async (bggId) => {
	const config = {
		params : {
			bggId
		}
	}

	const { data } = await axsAUTH.get('/api/misc/bgg/recommendations', config)
	return data
}

export const apiFetchVideos = async (bggId) => {
	const config = {
		params : {
			bggId
		}
	}

	const { data } = await axsAUTH.get('/api/misc/bgg/videos', config)
	return data
}

export const apiFetchBggNewReleases = async () => {
	const { data } = await axsAUTH.get('/api/misc/bgg/releases')
	return data
}

export const apiFetchBggCrowdfunding = async () => {
	const { data } = await axsAUTH.get('/api/misc/bgg/crowdfunding')
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

export const apiHistoryDeleteGame = async (id) => {
	return await axsAUTH.delete(`/api/history/${id}`)
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

export const apiFetchMyListedGames = async (search, page) => {
	const config = {
		params : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axsAUTH.get(`/api/games/user/listed`, config)
	return data
}

export const apiAddSoldGamesToHistory = async (gamesData) => {
	return await axsAUTH.post('/api/history/sell', gamesData)
}

export const apiUploadImage = async (img) => {
	const { data } = await axsAUTH.post('/api/games/images', img)
	return data
}

export const apiDeleteImage = async (fileName, bggId) => {
	const { data } = await axsAUTH.delete('/api/games/images', { data: { fileName, bggId } })
	return data
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

export const apiFetchBggHotGames = async () => {
	const { data } = await axsAUTH.get('/api/misc/bgg/hot')
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

export const apiEditSaleListing = async (update, id) => {
	return await axsAUTH.patch(`/api/games/sell/${id}/edit`, update)
}

export const apiEditTradeListing = async (update, id) => {
	return await axsAUTH.patch(`/api/games/trade/${id}/edit`, update)
}

export const apiEditWantedListing = async (update, id) => {
	return await axsAUTH.patch(`/api/games/wanted/${id}/edit`, update)
}

export const apiGetProfileData = async (username) => {
	const { data } = await axsAUTH.get(`/api/users/${username}`)
	return data
}

export const apiGetProfileListingsData = async (username) => {
	const { data } = await axsAUTH.get(`/api/users/${username}/listings`)
	return data
}

export const apiGetList = async () => {
	const { data } = await axsAUTH.get(`/api/list`)
	return data
}

export const apiAddOneToList = async (update) => {
	const { data } = await axsAUTH.patch(`/api/list`, update)
	return data
}

export const apiDeleteOneFromList = async (bggId) => {
	const { data } = await axsAUTH.delete(`/api/list`, { data: { bggId } })
	return data
}

export const apiClearList = async () => {
	await axsAUTH.delete(`/api/list/clear`)
}

export const apiGetOwnAvatar = async () => {
	const { data } = await axsAUTH.get(`/api/users/avatar`)
	return data
}

export const apiSubmitReport = async (data) => {
	await axsAUTH.post(`/api/misc/report`, data)
}

export const apiGetSocials = async () => {
	const { data } = await axsAUTH.get(`/api/users/socials`)
	return data
}

export const apiUpdateSocials = async ({ bggUsername, fbgUsername, show }) => {
	const data = {
		bggUsername : bggUsername ? bggUsername : null,
		fbgUsername : fbgUsername ? fbgUsername : null,
		show
	}

	await axsAUTH.post('/api/users/socials', data)
}

export const apiGetNewListings = async () => {
	const { data } = await axsPUBLIC.get(`/api/games/new`)
	return data
}

export const apiGetEmailNotificationStatus = async () => {
	const { data } = await axsAUTH.get(`/api/users/email/status`)
	return data
}

export const apiUpdateEmailNotificationStatus = async () => {
	const { data } = await axsAUTH.patch(`/api/users/email/status`, {})
	return data
}
