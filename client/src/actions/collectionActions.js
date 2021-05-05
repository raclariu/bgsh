import axios from 'axios'
import {
	COLLECTION_LIST_BGG_REQUEST,
	COLLECTION_LIST_BGG_SUCCESS,
	COLLECTION_LIST_BGG_FAIL,
	COLLECTION_LIST_BGG_RESET,
	COLLECTION_LIST_DB_REQUEST,
	COLLECTION_LIST_DB_SUCCESS,
	COLLECTION_LIST_DB_FAIL
} from '../constants/collectionConstants'

export const getCollectionFromBGG = (bggUsername) => async (dispatch, getState) => {
	try {
		dispatch({ type: COLLECTION_LIST_BGG_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/collections/', { bggUsername }, config)

		dispatch({
			type : COLLECTION_LIST_BGG_SUCCESS
		})

		dispatch({
			type : COLLECTION_LIST_BGG_RESET
		})
	} catch (error) {
		const { status, errors } = error.response.data

		dispatch({
			type    : COLLECTION_LIST_BGG_FAIL,
			payload : error.response && error.response.data ? { status, errors } : error.message
		})
	}
}

export const getCollectionFromDB = (searchKeyword, pageNumber) => async (dispatch, getState) => {
	try {
		dispatch({ type: COLLECTION_LIST_DB_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			},
			params  : {
				search : searchKeyword ? searchKeyword.trim() : null,
				page   : pageNumber
			}
		}

		const { data } = await axios.get(`/api/collections`, config)

		dispatch({
			type    : COLLECTION_LIST_DB_SUCCESS,
			payload : data
		})
	} catch (error) {
		const { status, errors } = error.response.data

		dispatch({
			type    : COLLECTION_LIST_DB_FAIL,
			payload : error.response && error.response.data ? { status, errors } : error.message
		})
	}
}
