import store from '../store'
import axios from 'axios'
import queryString from 'query-string'

const getBearer = () => {
	const state = store.getState()
	return `Bearer ${state.userAuth.userData.token}`
}

export const fetchKickstarters = async () => {
	const { data } = await axios.get('/api/misc/kickstarters')
	return data
}

export const apiGetNotifications = async () => {
	const config = {
		headers : {
			Authorization : getBearer()
		}
	}
	const { data } = await axios.get('/api/users/notifications', config)
	return data
}

export const apiUserChangePassword = async ({ passwordCurrent, passwordNew, passwordNewConfirmation }) => {
	const config = {
		headers : {
			Authorization : getBearer()
		}
	}

	await axios.post('/api/users/password', { passwordCurrent, passwordNew, passwordNewConfirmation }, config)
}

export const fetchGames = async ({ search, page, sort, mode }) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1,
			sort   : sort ? sort : 'new',
			mode
		}
	}
	const { data } = await axios.get('/api/games', config)

	return data
}

export const apiGetSentMessages = async (search, page) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/messages/sent', config)
	return data
}

export const apiGetReceivedMessages = async (search, page) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/messages/received', config)
	return data
}

export const apiUpdateMessageStatus = async (id) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	return await axios.patch(`/api/messages/update/${id}`, {}, config)
}

export const apiGetNewMessagesCount = async () => {
	const config = {
		headers : {
			Authorization : getBearer()
		}
	}
	const { data } = await axios.get('/api/messages/new/count', config)
	return data
}

export const apiDeleteMessages = async (ids, type) => {
	const config = {
		headers          : {
			Authorization : getBearer()
		},
		params           : {
			type,
			ids
		},
		paramsSerializer : (params) => queryString.stringify(params, { arrayFormat: 'bracket' })
	}
	return await axios.delete('/api/messages/delete', config)
}

export const apiFetchOwnedCollection = async (search, page) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/collections/owned', config)
	return data
}

export const apiFetchWantedGames = async (search, page) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/games/wanted', config)
	return data
}

export const apiFetchWishlistCollection = async (search, page) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/collections/wishlist', config)
	return data
}

export const apiFetchSingleGame = async (altId) => {
	const config = {
		headers : {
			Authorization : getBearer()
		}
	}

	const { data } = await axios.get(`/api/games/${altId}`, config)
	return data
}

export const apiFetchSavedGames = async (search, page) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/games/saved', config)
	return data
}

export const apiFetchGameSavedStatus = async (altId) => {
	const config = {
		headers : {
			Authorization : getBearer()
		}
	}

	const { data } = await axios.get(`/api/games/${altId}/save`, config)
	return data
}

export const apiUpdateSavedGameStatus = async (altId) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	const { data } = await axios.patch(`/api/games/${altId}/save`, {}, config)
	return data
}

export const apiFetchGallery = async (bggIds) => {
	const config = {
		headers          : {
			Authorization : getBearer()
		},
		params           : {
			bggIds
		},
		paramsSerializer : (params) => queryString.stringify(params, { arrayFormat: 'bracket' })
	}

	const { data } = await axios.get('/api/misc/bgg/gallery', config)
	return data
}

export const apiFetchGamesHistory = async ({ search, page, mode }) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1,
			mode
		}
	}

	const { data } = await axios.get('/api/history', config)
	return data
}

export const apiSendMessage = async (subject, message, recipient) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	return await axios.post('/api/messages', { subject, message, recipient }, config)
}

export const apiFetchBggCollection = async (bggUsername) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.post('/api/collections', { bggUsername }, config)
}

export const apiBggSearchGames = async (search) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		},
		params  : {
			search : search ? search.trim() : null
		}
	}

	const { data } = await axios.get('/api/misc/bgg/search', config)
	return data
}

export const apiFetchListedGames = async (search, page) => {
	const { userAuth: { userData } } = store.getState()
	const config = {
		headers : {
			Authorization : `Bearer ${userData.token}`
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get(`/api/games/user/${userData._id}`, config)
	return data
}

export const apiAddGameToHistory = async (gamesData) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	return await axios.post('/api/history', gamesData, config)
}

export const apiDeleteListedGame = async (id) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.delete(`/api/games/${id}/delete`, config)
}

export const apiReactivateListedGame = async (id) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.patch(`/api/games/${id}/reactivate`, {}, config)
}

export const apiFetchHotGames = async () => {
	const { data } = await axios.get('/api/misc/bgg/hot')
	return data
}

export const apiFetchGameDetails = async (bggIds) => {
	const config = {
		headers          : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		},
		params           : {
			bggIds
		},
		paramsSerializer : (params) => queryString.stringify(params, { arrayFormat: 'bracket' })
	}

	const { data } = await axios.get('/api/misc/bgg/games', config)
	return data
}

export const apiListGamesForTrade = async (gamesData) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.post('/api/games/trade', gamesData, config)
}

export const apiListGamesForSale = async (gamesData) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.post('/api/games/sell', gamesData, config)
}

export const apiAddWantedGames = async (gamesData) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.post('/api/games/wanted', gamesData, config)
}

export const apiGetProfileData = async (username) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}
	const { data } = await axios.get(`/api/users/${username}`, config)
	return data
}
