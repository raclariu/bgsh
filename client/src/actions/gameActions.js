import axios from 'axios'
import {
	BGG_GAMES_DETAILS_REQUEST,
	BGG_GAMES_DETAILS_SUCCESS,
	BGG_GAMES_DETAILS_FAIL,
	SALE_LIST_ADD,
	SALE_LIST_REMOVE
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
