import axios from 'axios'
import {
	BGG_COLLECTION_LIST_REQUEST,
	BGG_COLLECTION_LIST_SUCCESS,
	BGG_COLLECTION_LIST_FAIL,
	BGG_COLLECTION_LIST_RESET,
	BGG_GAME_DETAILS_REQUEST,
	BGG_GAME_DETAILS_SUCCESS,
	BGG_GAME_DETAILS_FAIL
} from '../constants/bggConstants'

export const bggGetCollection = (bggUsername) => async (dispatch, getState) => {
	try {
		dispatch({ type: BGG_COLLECTION_LIST_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/collections/', { bggUsername }, config)

		dispatch({
			type : BGG_COLLECTION_LIST_SUCCESS
		})

		dispatch({
			type : BGG_COLLECTION_LIST_RESET
		})
	} catch (error) {
		const { status, errors } = error.response.data

		dispatch({
			type    : BGG_COLLECTION_LIST_FAIL,
			payload : error.response && error.response.data ? { status, errors } : error.message
		})
	}
}

export const bggGetGameDetails = (bggId) => async (dispatch, getState) => {
	try {
		dispatch({ type: BGG_GAME_DETAILS_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get(`/api/collections/${bggId}`, config)

		dispatch({
			type    : BGG_GAME_DETAILS_SUCCESS,
			payload : data
		})
	} catch (error) {
		const { status, errors } = error.response.data

		dispatch({
			type    : BGG_GAME_DETAILS_FAIL,
			payload : error.response && error.response.data ? { status, errors } : error.message
		})
	}
}
