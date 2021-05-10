import { BGG_GAME_DETAILS_REQUEST, BGG_GAME_DETAILS_SUCCESS, BGG_GAME_DETAILS_FAIL } from '../constants/gameConstants'

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
