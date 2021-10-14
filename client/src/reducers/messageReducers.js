import {
	SEND_MESSAGE_REQUEST,
	SEND_MESSAGE_SUCCESS,
	SEND_MESSAGE_FAIL,
	SEND_MESSAGE_RESET,
	GET_RECEIVED_MESSAGES_REQUEST,
	GET_RECEIVED_MESSAGES_SUCCESS,
	GET_RECEIVED_MESSAGES_FAIL,
	GET_SENT_MESSAGES_REQUEST,
	GET_SENT_MESSAGES_SUCCESS,
	GET_SENT_MESSAGES_FAIL,
	GET_NEW_MESSAGES_COUNT_REQUEST,
	GET_NEW_MESSAGES_COUNT_SUCCESS,
	GET_NEW_MESSAGES_COUNT_FAIL,
	DELETE_MESSAGES_REQUEST,
	DELETE_MESSAGES_SUCCESS,
	DELETE_MESSAGES_FAIL,
	UPDATE_MESSAGE_SUCCESS,
	UPDATE_MESSAGE_FAIL
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

export const getReceivedMessagesReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_RECEIVED_MESSAGES_REQUEST:
			return { loading: true }
		case GET_RECEIVED_MESSAGES_SUCCESS:
			return {
				loading    : false,
				success    : true,
				messages   : action.payload.messages,
				pagination : action.payload.pagination
			}
		case GET_RECEIVED_MESSAGES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const getSentMessagesReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_SENT_MESSAGES_REQUEST:
			return { loading: true }
		case GET_SENT_MESSAGES_SUCCESS:
			return {
				loading    : false,
				success    : true,
				messages   : action.payload.messages,
				pagination : action.payload.pagination
			}
		case GET_SENT_MESSAGES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const deleteMessagesReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_MESSAGES_REQUEST:
			return { loading: true }
		case DELETE_MESSAGES_SUCCESS:
			return { loading: false, success: true }
		case DELETE_MESSAGES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const updateMessageReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_MESSAGE_SUCCESS:
			return { success: true }
		case UPDATE_MESSAGE_FAIL:
			return { error: action.payload }

		default:
			return state
	}
}

export const getNewMessagesCountReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_NEW_MESSAGES_COUNT_REQUEST:
			return { loading: true }
		case GET_NEW_MESSAGES_COUNT_SUCCESS:
			return { loading: false, success: true, count: action.payload }
		case GET_NEW_MESSAGES_COUNT_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
