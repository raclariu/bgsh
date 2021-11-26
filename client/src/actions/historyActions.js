import axios from 'axios'
import {
	HISTORY_ADD_REQUEST,
	HISTORY_ADD_SUCCESS,
	HISTORY_ADD_FAIL,
	HISTORY_SOLD_LIST_REQUEST,
	HISTORY_SOLD_LIST_SUCCESS,
	HISTORY_SOLD_LIST_FAIL,
	HISTORY_TRADED_LIST_REQUEST,
	HISTORY_TRADED_LIST_SUCCESS,
	HISTORY_TRADED_LIST_FAIL
} from '../constants/historyConstants'

export const addGamesToHistory = (games, username, price, gameId) => async (dispatch, getState) => {
	try {
		dispatch({ type: HISTORY_ADD_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userData.token}`
			}
		}

		await axios.post('/api/history', { games, username, price, gameId }, config)

		dispatch({
			type : HISTORY_ADD_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : HISTORY_ADD_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getSoldGamesHistory = (page, search) => async (dispatch, getState) => {
	try {
		dispatch({ type: HISTORY_SOLD_LIST_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userData.token}`
			},
			params  : {
				search : search ? search.trim() : null,
				page   : +page ? +page : 1
			}
		}

		const { data } = await axios.get('/api/history/sold', config)

		dispatch({
			type    : HISTORY_SOLD_LIST_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : HISTORY_SOLD_LIST_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getTradedGamesHistory = (page, search) => async (dispatch, getState) => {
	try {
		dispatch({ type: HISTORY_TRADED_LIST_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userData.token}`
			},
			params  : {
				search : search ? search.trim() : null,
				page   : +page ? +page : 1
			}
		}

		const { data } = await axios.get('/api/history/traded', config)

		dispatch({
			type    : HISTORY_TRADED_LIST_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : HISTORY_TRADED_LIST_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
