import axios from 'axios'
import {
	BGG_GAMES_DETAILS_REQUEST,
	BGG_GAMES_DETAILS_SUCCESS,
	BGG_GAMES_DETAILS_FAIL,
	BGG_HOT_GAMES_REQUEST,
	BGG_HOT_GAMES_SUCCESS,
	BGG_HOT_GAMES_FAIL,
	BGG_GAME_GALLERY_REQUEST,
	BGG_GAME_GALLERY_SUCCESS,
	BGG_GAME_GALLERY_FAIL,
	SALE_LIST_ADD,
	SALE_LIST_REMOVE,
	SELL_GAMES_REQUEST,
	SELL_GAMES_SUCCESS,
	SELL_GAMES_FAIL,
	TRADE_GAMES_REQUEST,
	TRADE_GAMES_SUCCESS,
	TRADE_GAMES_FAIL,
	BGG_GAMES_SEARCH_REQUEST,
	BGG_GAMES_SEARCH_SUCCESS,
	BGG_GAMES_SEARCH_FAIL,
	GAMES_INDEX_REQUEST,
	GAMES_INDEX_SUCCESS,
	GAMES_INDEX_FAIL,
	FOR_SALE_SINGLE_GAME_REQUEST,
	FOR_SALE_SINGLE_GAME_SUCCESS,
	FOR_SALE_SINGLE_GAME_FAIL,
	SAVE_GAME_SWITCH_REQUEST,
	SAVE_GAME_SWITCH_SUCCESS,
	SAVE_GAME_SWITCH_FAIL,
	SAVED_GAMES_REQUEST,
	SAVED_GAMES_SUCCESS,
	SAVED_GAMES_FAIL,
	SAVED_GAMES_SINGLE_REQUEST,
	SAVED_GAMES_SINGLE_SUCCESS,
	SAVED_GAMES_SINGLE_FAIL,
	USER_ACTIVE_GAMES_REQUEST,
	USER_ACTIVE_GAMES_SUCCESS,
	USER_ACTIVE_GAMES_FAIL,
	GAME_DELETE_REQUEST,
	GAME_DELETE_SUCCESS,
	GAME_DELETE_FAIL,
	GAME_REACTIVATE_REQUEST,
	GAME_REACTIVATE_SUCCESS,
	GAME_REACTIVATE_FAIL,
	saleListLimit
} from '../constants/gameConstants'

export const bggGetGamesDetails = (bggIds) => async (dispatch, getState) => {
	try {
		dispatch({ type: BGG_GAMES_DETAILS_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.post('/api/games/bgg', { bggIds }, config)

		dispatch({
			type    : BGG_GAMES_DETAILS_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : BGG_GAMES_DETAILS_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const bggGetHotGames = () => async (dispatch) => {
	try {
		dispatch({ type: BGG_HOT_GAMES_REQUEST })

		const { data } = await axios.get('/api/games/bgg/hot')

		dispatch({
			type    : BGG_HOT_GAMES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : BGG_HOT_GAMES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const bggGetGallery = (bggIds) => async (dispatch, getState) => {
	try {
		dispatch({ type: BGG_GAME_GALLERY_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get(`/api/games/bgg/${bggIds}/images`, config)

		dispatch({
			type    : BGG_GAME_GALLERY_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : BGG_GAME_GALLERY_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const addToSaleList = (data) => (dispatch, getState) => {
	const { saleList } = getState()

	if (saleList.length === saleListLimit) {
		return
	}

	if (saleList.find((el) => el.bggId === data.bggId)) {
		return
	}

	localStorage.setItem('saleList', JSON.stringify([ ...saleList, data ]))

	dispatch({
		type    : SALE_LIST_ADD,
		payload : data
	})
}

export const removeFromSaleList = (id) => (dispatch, getState) => {
	const { saleList } = getState()

	const filtered = saleList.filter((el) => el.bggId !== id)
	localStorage.setItem('saleList', JSON.stringify(filtered))

	dispatch({
		type    : SALE_LIST_REMOVE,
		payload : filtered
	})
}

export const bggSearchGames = (keyword) => async (dispatch, getState) => {
	try {
		dispatch({ type: BGG_GAMES_SEARCH_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.post('/api/games/bgg/search', { keyword }, config)

		dispatch({
			type    : BGG_GAMES_SEARCH_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : BGG_GAMES_SEARCH_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const sellGames = (gamesData) => async (dispatch, getState) => {
	try {
		dispatch({ type: SELL_GAMES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/games/sell', gamesData, config)

		dispatch({
			type : SELL_GAMES_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : SELL_GAMES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const tradeGames = (gamesData) => async (dispatch, getState) => {
	try {
		dispatch({ type: TRADE_GAMES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/games/trade', gamesData, config)

		dispatch({
			type : TRADE_GAMES_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : TRADE_GAMES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getGames = (search, page, sort, mode) => async (dispatch, getState) => {
	try {
		dispatch({ type: GAMES_INDEX_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			},
			params  : {
				search : search ? search.trim() : null,
				page   : +page ? +page : 1,
				sort   : sort ? sort : 'new',
				mode
			}
		}

		const { data } = await axios.get('/api/games', config)

		dispatch({
			type    : GAMES_INDEX_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GAMES_INDEX_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getUserActiveGames = (search, page) => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_ACTIVE_GAMES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			},
			params  : {
				search : search ? search.trim() : null,
				page   : +page ? +page : 1
			}
		}

		const { data } = await axios.get(`/api/games/user/${userInfo._id}`, config)

		dispatch({
			type    : USER_ACTIVE_GAMES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : USER_ACTIVE_GAMES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const reactivateGame = (gameId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GAME_REACTIVATE_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		await axios.patch(`/api/games/reactivate/${gameId}`, {}, config)

		dispatch({
			type : GAME_REACTIVATE_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : GAME_REACTIVATE_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getSingleGame = (altId) => async (dispatch, getState) => {
	try {
		dispatch({ type: FOR_SALE_SINGLE_GAME_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get(`/api/games/${altId}`, config)

		dispatch({
			type    : FOR_SALE_SINGLE_GAME_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : FOR_SALE_SINGLE_GAME_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const switchSaveGame = (altId) => async (dispatch, getState) => {
	try {
		dispatch({ type: SAVE_GAME_SWITCH_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.post('/api/games/saved', { altId }, config)

		dispatch({
			type    : SAVE_GAME_SWITCH_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : SAVE_GAME_SWITCH_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getSingleSavedGame = (altId) => async (dispatch, getState) => {
	try {
		dispatch({ type: SAVED_GAMES_SINGLE_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get(`/api/games/saved/${altId}`, config)

		dispatch({
			type    : SAVED_GAMES_SINGLE_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : SAVED_GAMES_SINGLE_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getSavedGames = (searchKeyword, pageNumber) => async (dispatch, getState) => {
	try {
		dispatch({ type: SAVED_GAMES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			},
			params  : {
				search : searchKeyword ? searchKeyword.trim() : null,
				page   : +pageNumber ? +pageNumber : 1
			}
		}

		const { data } = await axios.get('/api/games/saved', config)

		dispatch({
			type    : SAVED_GAMES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : SAVED_GAMES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const deleteGame = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: GAME_DELETE_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		await axios.delete(`/api/games/delete/${id}`, config)

		dispatch({
			type : GAME_DELETE_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : GAME_DELETE_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
