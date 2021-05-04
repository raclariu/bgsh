import {
	COLLECTION_LIST_BGG_REQUEST,
	COLLECTION_LIST_BGG_SUCCESS,
	COLLECTION_LIST_BGG_FAIL,
	COLLECTION_LIST_BGG_RESET,
	COLLECTION_LIST_DB_REQUEST,
	COLLECTION_LIST_DB_SUCCESS,
	COLLECTION_LIST_DB_FAIL
} from '../constants/collectionConstants'

export const getCollectionFromBGGReducer = (state = {}, action) => {
	switch (action.type) {
		case COLLECTION_LIST_BGG_REQUEST:
			return { loading: true }
		case COLLECTION_LIST_BGG_SUCCESS:
			return { loading: false, success: true, bggCollection: action.payload }
		case COLLECTION_LIST_BGG_FAIL:
			return { loading: false, error: action.payload }
		case COLLECTION_LIST_BGG_RESET:
			return { reset: true }

		default:
			return state
	}
}

export const getCollectionFromDBReducer = (state = {}, action) => {
	switch (action.type) {
		case COLLECTION_LIST_DB_REQUEST:
			return { loading: true }
		case COLLECTION_LIST_DB_SUCCESS:
			return {
				loading      : false,
				success      : true,
				dbCollection : action.payload.collection,
				pagination   : action.payload.pagination
			}
		case COLLECTION_LIST_DB_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
