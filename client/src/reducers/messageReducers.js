import {
	SEND_MESSAGE_REQUEST,
	SEND_MESSAGE_SUCCESS,
	SEND_MESSAGE_FAIL,
	SEND_MESSAGE_RESET,
	GET_MESSAGES_REQUEST,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL
} from '../constants/messageConstants'

export const sendMessageReducer = (state = {}, action) => {
	switch (action.type) {
		case SEND_MESSAGE_REQUEST:
			return { loading: true }
		case SEND_MESSAGE_SUCCESS:
			return { loading: false, success: true }
		case SEND_MESSAGE_FAIL:
			return { loading: false, error: action.payload }

		case SEND_MESSAGE_RESET:
			return {}

		default:
			return state
	}
}

export const getAllMessagesReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_MESSAGES_REQUEST:
			return { loading: true }
		case GET_MESSAGES_SUCCESS:
			return { loading: false, success: true, received: action.payload.received, sent: action.payload.sent }
		case GET_MESSAGES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
