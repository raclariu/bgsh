import { axsPUBLIC, axsAUTH } from '../api/axs'
import {
	USER_AUTH_REQUEST,
	USER_AUTH_SUCCESS,
	USER_AUTH_FAIL,
	USER_LOGOUT,
	USER_PREFERENCES_SET_THEME
} from '../constants/userConstants'

export const logIn = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_AUTH_REQUEST })

		const { data } = await axsPUBLIC.post('/api/users/login', { email, password })

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

export const logOut = () => async (dispatch) => {
	localStorage.removeItem('userData')

	dispatch({ type: USER_LOGOUT })
}

export const setCurrentTheme = (theme) => async (dispatch) => {
	localStorage.setItem('currentTheme', JSON.stringify(theme))

	dispatch({ type: USER_PREFERENCES_SET_THEME, payload: theme })
}
