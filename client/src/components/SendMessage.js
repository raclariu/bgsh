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

// @ Others
import { userSendMessage } from '../actions/userActions'

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
const SendMessage = ({ title = '', recipientUsername, recipientId }) => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ open, setOpen ] = useState(false)

	const [ recipient, setRecipient ] = useState(recipientUsername)
	const [ subject, setSubject ] = useState(`Doresc sa cumpar ${title}`)
	const [ message, setMessage ] = useState('')
	const handleOpenDialog = () => {
		setOpen(true)
	}

	const handleCloseDialog = () => {
		setOpen(false)
	}

	const submitHandler = (e) => {
		e.preventDefault()
		console.log('sub')
		console.log(subject, message, recipientUsername, recipientId)
		dispatch(userSendMessage(subject, message, recipientUsername, recipientId))
	}

	return (
		<Fragment>
			<IconButton color="primary" onClick={handleOpenDialog}>
				<MailTwoToneIcon fontSize="small" />
			</IconButton>

			<Dialog fullWidth maxWidth="xs" open={open} onClose={handleCloseDialog}>
				<form onSubmit={submitHandler} autoComplete="off">
					<DialogContent>
						<TextField
							className={cls.input}
							onChange={(e) => setRecipient(e.target.value)}
							value={recipient}
							variant="outlined"
							id="recipient"
							name="recipient"
							label="Recipient"
							type="text"
							disabled={recipientId ? true : false}
							fullWidth
							required
						/>

						<TextField
							className={cls.input}
							onChange={(e) => setSubject(e.target.value)}
							value={subject}
							variant="outlined"
							id="subject"
							name="subject"
							label="Subject"
							type="text"
							fullWidth
							required
						/>

						<TextField
							onChange={(e) => setMessage(e.target.value)}
							value={message}
							inputProps={{
								maxLength   : 500,
								placeholder : 'Your message (500 characters limit)'
							}}
							variant="outlined"
							id="message"
							name="message"
							label="Message"
							type="text"
							size="small"
							multiline
							rows={3}
							rowsMax={10}
							fullWidth
							required
						/>
					</DialogContent>
					<DialogActions>
						<Button color="primary" type="submit" variant="outlined">
							Send
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Fragment>
	)
}

export default SendMessage
