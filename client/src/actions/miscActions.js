import axios from 'axios'
import { GET_KICKSTARTERS_REQUEST, GET_KICKSTARTERS_SUCCESS, GET_KICKSTARTERS_FAIL } from '../constants/miscConstants'

export const getKickstarters = () => async (dispatch) => {
	try {
		dispatch({ type: GET_KICKSTARTERS_REQUEST })

		const { data } = await axios.get('/api/misc/kickstarters')

		dispatch({
			type    : GET_KICKSTARTERS_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_KICKSTARTERS_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
