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

export const apiGetSentMessages = async (page) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		},
		params  : {
			page : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/messages/sent', config)
	return data
}

export const apiGetReceivedMessages = async (page) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		},
		params  : {
			page : +page ? +page : 1
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
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}
	const { data } = await axios.get('/api/messages/new', config)
	return data
}

export const apiDeleteMessages = async (ids, type) => {
	console.log(ids, type)
	return await axios.patch(
		'/api/messages/delete',
		{ ids, type },
		{
			headers : {
				Authorization : getBearer()
			}
		}
	)
}

export const apiFetchCollection = async (search, page) => {
	const config = {
		headers : {
			Authorization : getBearer()
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get('/api/collections', config)
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

export const apiFetchWishlist = async (search, page) => {
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
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
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
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	const { data } = await axios.get(`/api/games/saved/${altId}`, config)
	return data
}

export const apiUpdateSavedStatus = async (altId) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	const { data } = await axios.post('/api/games/saved', { altId }, config)
	return data
}

export const apiFetchGallery = async (bggIds) => {
	const config = {
		headers          : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		},
		params           : {
			bggIds
		},
		paramsSerializer : (params) => {
			return queryString.stringify(params, { arrayFormat: 'bracket' })
		}
	}

	const { data } = await axios.get('/api/games/bgg/gallery', config)
	return data
}

export const apiFetchSoldGames = async (search, page) => {
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

	const { data } = await axios.get('/api/history/sold', config)
	return data
}

export const apiFetchTradedGames = async (search, page) => {
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

	const { data } = await axios.get('/api/history/traded', config)
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

export const apiFetchUserWantedGames = async (search, page) => {
	const { userAuth: { userData } } = store.getState()
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : `Bearer ${userData.token}`
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get(`/api/games/user/${userData._id}/wanted`, config)
	return data
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

export const apiBggSearchGames = async (keyword) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	const { data } = await axios.post('/api/games/bgg/search', { keyword }, config)
	return data
}

export const apiFetchListedGames = async (search, page) => {
	const { userAuth: { userData } } = store.getState()
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : `Bearer ${userData.token}`
		},
		params  : {
			search : search ? search.trim() : null,
			page   : +page ? +page : 1
		}
	}

	const { data } = await axios.get(`/api/games/user/${userData._id}`, config)
	return data
}

export const apiAddGameToHistory = async (games, username, price, gameId) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	return await axios.post('/api/history', { games, username, price, gameId }, config)
}

export const apiDeleteListedGame = async (id) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.delete(`/api/games/delete/${id}`, config)
}

export const apiReactivateListedGame = async (id) => {
	const config = {
		headers : {
			'Content-Type' : 'application/json',
			Authorization  : getBearer()
		}
	}

	await axios.patch(`/api/games/reactivate/${id}`, {}, config)
}

export const apiFetchHotGames = async () => {
	const { data } = await axios.get('/api/games/bgg/hot')
	return data
}
