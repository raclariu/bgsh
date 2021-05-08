import axios from 'axios'
import {
	DB_COLLECTION_LIST_REQUEST,
	DB_COLLECTION_LIST_SUCCESS,
	DB_COLLECTION_LIST_FAIL
} from '../constants/gamesConstants'

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
				page   : pageNumber
			}
		}

		const { data } = await axios.get(`/api/collections`, config)

		dispatch({
			type    : DB_COLLECTION_LIST_SUCCESS,
			payload : data
		})
	} catch (error) {
		const { status, errors } = error.response.data

		dispatch({
			type    : DB_COLLECTION_LIST_FAIL,
			payload : error.response && error.response.data ? { status, errors } : error.message
		})
	}
}
