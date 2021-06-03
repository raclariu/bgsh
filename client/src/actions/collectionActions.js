import axios from 'axios'
import {
	BGG_COLLECTION_LIST_REQUEST,
	BGG_COLLECTION_LIST_SUCCESS,
	BGG_COLLECTION_LIST_FAIL,
	BGG_COLLECTION_LIST_RESET,
	DB_COLLECTION_LIST_REQUEST,
	DB_COLLECTION_LIST_SUCCESS,
	DB_COLLECTION_LIST_FAIL,
	WISHLIST_LIST_REQUEST,
	WISHLIST_LIST_SUCCESS,
	WISHLIST_LIST_FAIL
} from '../constants/collectionConstants'

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
		dispatch({
			type    : BGG_COLLECTION_LIST_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const dbGetCollection = (searchKeyword, pageNumber) => async (dispatch, getState) => {
	try {
		dispatch({ type: DB_COLLECTION_LIST_REQUEST })

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

		const { data } = await axios.get('/api/collections', config)

		dispatch({
			type    : DB_COLLECTION_LIST_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : DB_COLLECTION_LIST_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getWishlist = (searchKeyword, pageNumber) => async (dispatch, getState) => {
	try {
		dispatch({ type: WISHLIST_LIST_REQUEST })

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

		const { data } = await axios.get('/api/collections/wishlist', config)

		dispatch({
			type    : WISHLIST_LIST_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : WISHLIST_LIST_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
