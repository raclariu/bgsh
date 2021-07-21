import {
	HISTORY_ADD_REQUEST,
	HISTORY_ADD_SUCCESS,
	HISTORY_ADD_FAIL,
	HISTORY_ADD_RESET,
	HISTORY_SOLD_LIST_REQUEST,
	HISTORY_SOLD_LIST_SUCCESS,
	HISTORY_SOLD_LIST_FAIL
} from '../constants/historyConstants'

export const addToHistoryReducer = (state = {}, action) => {
	switch (action.type) {
		case HISTORY_ADD_REQUEST:
			return { loading: true }

		case HISTORY_ADD_SUCCESS:
			return { loading: false, success: true }

		case HISTORY_ADD_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const getSoldGamesHistoryReducer = (state = {}, action) => {
	switch (action.type) {
		case HISTORY_SOLD_LIST_REQUEST:
			return { loading: true }

		case HISTORY_SOLD_LIST_SUCCESS:
			return {
				loading: false,
				success: true,
				soldList: action.payload.soldList,
				pagination: action.payload.pagination
			}

		case HISTORY_SOLD_LIST_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
