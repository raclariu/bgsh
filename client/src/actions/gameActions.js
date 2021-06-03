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
	saleListLimit,
	FOR_SALE_GAMES_REQUEST,
	FOR_SALE_GAMES_SUCCESS,
	FOR_SALE_GAMES_FAIL
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

export const getGamesForSale = () => async (dispatch, getState) => {
	try {
		dispatch({ type: FOR_SALE_GAMES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get('/api/games/', config)

		dispatch({
			type    : FOR_SALE_GAMES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : FOR_SALE_GAMES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
