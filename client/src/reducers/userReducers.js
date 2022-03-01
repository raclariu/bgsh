// @ Constants
import { USER_AUTH_SUCCESS, USER_LOGOUT, USER_PREFERENCES_SET_THEME } from '../constants/userConstants'

export const userAuthReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_AUTH_SUCCESS:
			return { userData: action.payload }
		case USER_LOGOUT:
			return {}
		default:
			return state
	}
}

export const setThemeReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_PREFERENCES_SET_THEME:
			return { theme: action.payload }

		default:
			return state
	}
}
