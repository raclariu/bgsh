import {
	BGG_COLLECTION_LIST_REQUEST,
	BGG_COLLECTION_LIST_SUCCESS,
	BGG_COLLECTION_LIST_FAIL,
	BGG_COLLECTION_LIST_RESET,
	BGG_GAME_DETAILS_REQUEST,
	BGG_GAME_DETAILS_SUCCESS,
	BGG_GAME_DETAILS_FAIL
} from '../constants/bggConstants'

export const bggGetCollectionReducer = (state = {}, action) => {
	switch (action.type) {
		case BGG_COLLECTION_LIST_REQUEST:
			return { loading: true }
		case BGG_COLLECTION_LIST_SUCCESS:
			return { loading: false, success: true }
		case BGG_COLLECTION_LIST_FAIL:
			return { loading: false, error: action.payload }
		case BGG_COLLECTION_LIST_RESET:
			return { reset: true }

		default:
			return state
	}
}

export const bggGetGameDetailsReducer = (state = {}, action) => {
	switch (action.type) {
		case BGG_GAME_DETAILS_REQUEST:
			return { loading: true }
		case BGG_GAME_DETAILS_SUCCESS:
			return {
				loading : false,
				success : true,
				game    : action.payload
			}
		case BGG_GAME_DETAILS_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
