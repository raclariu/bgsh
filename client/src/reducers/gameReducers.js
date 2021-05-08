import {
	DB_COLLECTION_LIST_REQUEST,
	DB_COLLECTION_LIST_SUCCESS,
	DB_COLLECTION_LIST_FAIL
} from '../constants/gamesConstants'

export const dbGetCollectionReducer = (state = {}, action) => {
	switch (action.type) {
		case DB_COLLECTION_LIST_REQUEST:
			return { loading: true }
		case DB_COLLECTION_LIST_SUCCESS:
			return {
				loading    : false,
				success    : true,
				collection : action.payload.collection,
				pagination : action.payload.pagination
			}
		case DB_COLLECTION_LIST_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
