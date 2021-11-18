import { GET_KICKSTARTERS_REQUEST, GET_KICKSTARTERS_SUCCESS, GET_KICKSTARTERS_FAIL } from '../constants/miscConstants'

export const getKickstartersReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_KICKSTARTERS_REQUEST:
			return { loading: true }
		case GET_KICKSTARTERS_SUCCESS:
			return {
				loading : false,
				success : true,
				ksList  : action.payload
			}
		case GET_KICKSTARTERS_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
