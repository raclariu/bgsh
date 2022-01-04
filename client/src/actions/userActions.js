import { axsPUBLIC, axsAUTH } from '../api/axs'
import {
	USER_AUTH_REQUEST,
	USER_AUTH_SUCCESS,
	USER_AUTH_FAIL,
	USER_SIGNOUT,
	USER_PREFERENCES_SET_THEME
} from '../constants/userConstants'

export const signIn = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_AUTH_REQUEST })

		const { data } = await axsPUBLIC.post('/api/users/signin', { email, password })

		dispatch({
			type    : USER_AUTH_SUCCESS,
			payload : data
		})

		localStorage.setItem('userData', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type    : USER_AUTH_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const signUp = (email, username, password, passwordConfirmation) => async (dispatch) => {
	try {
		dispatch({ type: USER_AUTH_REQUEST })

		const { data } = await axsPUBLIC.post('/api/users/signup', { email, username, password, passwordConfirmation })

		dispatch({
			type    : USER_AUTH_SUCCESS,
			payload : data
		})

		localStorage.setItem('userData', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type    : USER_AUTH_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const signOut = () => async (dispatch) => {
	localStorage.removeItem('userData')

	dispatch({ type: USER_SIGNOUT })
}

export const setCurrentTheme = (theme) => async (dispatch) => {
	localStorage.setItem('currentTheme', JSON.stringify(theme))

	dispatch({ type: USER_PREFERENCES_SET_THEME, payload: theme })
}
