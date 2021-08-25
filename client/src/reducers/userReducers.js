// @ Constants
import {
	USER_SIGNIN_REQUEST,
	USER_SIGNIN_SUCCESS,
	USER_SIGNIN_FAIL,
	USER_SIGNOUT,
	USER_SIGNUP_REQUEST,
	USER_SIGNUP_SUCCESS,
	USER_SIGNUP_FAIL,
	USER_PREFERENCES_SET_THEME,
	USER_CHANGE_PASSWORD_REQUEST,
	USER_CHANGE_PASSWORD_SUCCESS,
	USER_CHANGE_PASSWORD_FAIL,
	USER_CHANGE_PASSWORD_RESET
} from '../constants/userConstants'

export const userSignInReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNIN_REQUEST:
			return { loading: true }
		case USER_SIGNIN_SUCCESS:
			return { loading: false, success: true, userInfo: action.payload }
		case USER_SIGNIN_FAIL:
			return { loading: false, error: action.payload }
		case USER_SIGNOUT:
			return {}

		default:
			return state
	}
}

export const userSignUpReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNUP_REQUEST:
			return { loading: true }
		case USER_SIGNUP_SUCCESS:
			return { loading: false, success: true, userInfo: action.payload }
		case USER_SIGNUP_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const userChangePasswordReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_CHANGE_PASSWORD_REQUEST:
			return { loading: true }
		case USER_CHANGE_PASSWORD_SUCCESS:
			return { loading: false, success: true }
		case USER_CHANGE_PASSWORD_FAIL:
			return { loading: false, error: action.payload }
		case USER_CHANGE_PASSWORD_RESET:
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
