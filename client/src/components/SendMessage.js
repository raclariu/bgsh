// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

// @ Mui Icons
import MailTwoToneIcon from '@material-ui/icons/MailTwoTone'

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Others
import { sendMessage } from '../actions/messageActions'
import { SEND_MESSAGE_RESET } from '../constants/messageConstants'

// @ Styles
const useStyles = makeStyles((theme) => ({
	root  : {
		width  : '100%',
		margin : theme.spacing(4, 0, 0, 0)
	},
	input : {
		minHeight : '90px'
	}
}))

// @Main
const SendMessage = ({ recipientUsername = '' }) => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ open, setOpen ] = useState(false)

	const [ recipient, setRecipient ] = useState(recipientUsername ? recipientUsername : '')
	const [ subject, setSubject ] = useState('')
	const [ message, setMessage ] = useState('')

	const sendMessageSelector = useSelector((state) => state.sendMessage)
	const { success, error, loading } = sendMessageSelector

	const username = useSelector((state) => state.userAuth.userData.username)

	useEffect(
		() => {
			return () => {
				if (success) {
					dispatch({ type: SEND_MESSAGE_RESET })
				}
			}
		},
		[ dispatch, success ]
	)

	const handleOpenDialog = () => {
		setOpen(true)
	}

	const handleCloseDialog = () => {
		setOpen(false)
	}

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(sendMessage(subject, message, recipient))
	}

	return (
		<Fragment>
			<CustomTooltip title="Send message">
				<span>
					<IconButton disabled={username === recipientUsername} color="primary" onClick={handleOpenDialog}>
						<MailTwoToneIcon fontSize="small" />
					</IconButton>
				</span>
			</CustomTooltip>

			<Dialog fullWidth maxWidth="sm" open={open} onClose={handleCloseDialog}>
				<form onSubmit={submitHandler} autoComplete="off">
					<DialogContent>
						<TextField
							className={cls.input}
							error={error && error.recipientUsernameError ? true : false}
							helperText={error ? error.recipientUsernameError : false}
							onChange={(e) => setRecipient(e.target.value)}
							value={recipient}
							inputProps={{
								minLength : 4,
								maxLength : 20
							}}
							variant="outlined"
							id="recipient"
							name="recipient"
							label="Username of recipient"
							type="text"
							disabled={recipientUsername ? true : false}
							fullWidth
							required
						/>

						<TextField
							className={cls.input}
							error={error && error.subjectError ? true : false}
							helperText={error ? error.subjectError : false}
							onChange={(e) => setSubject(e.target.value)}
							value={subject}
							inputProps={{
								minLength : 1,
								maxLength : 60
							}}
							variant="outlined"
							id="subject"
							name="subject"
							label={`Subject (${subject.length}/60)`}
							type="text"
							fullWidth
							required
						/>

						<TextField
							error={error && error.messageError ? true : false}
							helperText={error ? error.messageError : false}
							onChange={(e) => setMessage(e.target.value)}
							value={message}
							inputProps={{
								minLength : 1,
								maxLength : 500
							}}
							variant="outlined"
							id="message"
							name="message"
							label={`Message (${message.length}/500)`}
							type="text"
							size="small"
							multiline
							minRows={3}
							maxRows={10}
							fullWidth
							required
						/>
					</DialogContent>

					<DialogActions>
						<Button disabled={username === recipient} color="primary" type="submit" variant="outlined">
							Send
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Fragment>
	)
}

export default SendMessage
