import axios from 'axios'
import {
	BGG_GAMES_DETAILS_REQUEST,
	BGG_GAMES_DETAILS_SUCCESS,
	BGG_GAMES_DETAILS_FAIL,
	SALE_LIST_ADD,
	SALE_LIST_REMOVE,
	SELL_GAMES_REQUEST,
	SELL_GAMES_SUCCESS,
	SELL_GAMES_FAIL,
	BGG_GAMES_SEARCH_REQUEST,
	BGG_GAMES_SEARCH_SUCCESS,
	BGG_GAMES_SEARCH_FAIL,
	GAMES_INDEX_REQUEST,
	GAMES_INDEX_SUCCESS,
	GAMES_INDEX_FAIL,
	FOR_SALE_SINGLE_GAME_REQUEST,
	FOR_SALE_SINGLE_GAME_SUCCESS,
	FOR_SALE_SINGLE_GAME_FAIL,
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

export const addToSaleList = (data) => (dispatch, getState) => {
	const { saleList } = getState()

	if (saleList.length === saleListLimit) {
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

export const getGames = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GAMES_INDEX_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get('/api/games/', config)

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
