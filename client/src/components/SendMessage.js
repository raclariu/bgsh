// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from 'react-query'

// @ Mui
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// @ Mui Icons
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone'

// @ Components
import CustomTooltip from './CustomTooltip'
import Input from './Input'

// @ Others
import { apiSendMessage } from '../api/api'

// @Main
const SendMessage = ({ recipientUsername = '' }) => {
	const queryClient = useQueryClient()

	const username = useSelector((state) => state.userAuth.userData.username)

	const mutation = useMutation(
		({ subject, message, recipient }) => {
			return apiSendMessage(subject, message, recipient)
		},
		{
			onSuccess : () => {
				queryClient.invalidateQueries([ 'msgSent' ])
			}
		}
	)

	const [ open, setOpen ] = useState(false)
	const [ recipient, setRecipient ] = useState(recipientUsername ? recipientUsername : '')
	const [ subject, setSubject ] = useState('')
	const [ message, setMessage ] = useState('')

	const handleOpenDialog = () => {
		setOpen(true)
	}

	const handleCloseDialog = () => {
		setOpen(false)
	}

	const submitHandler = (e) => {
		e.preventDefault()

		mutation.mutate({ subject, message, recipient })
	}

	return (
		<Fragment>
			<CustomTooltip title="Send message">
				<IconButton
					disabled={username === recipientUsername}
					color="primary"
					onClick={handleOpenDialog}
					size="large"
				>
					<MailTwoToneIcon fontSize="small" />
				</IconButton>
			</CustomTooltip>

			<Dialog fullWidth maxWidth="sm" open={open} onClose={handleCloseDialog}>
				<form onSubmit={submitHandler} autoComplete="off">
					<DialogContent>
						<Input
							sx={{ minHeight: '90px' }}
							error={
								mutation.isError && mutation.error.response.data.message.recipientError ? true : false
							}
							helperText={mutation.isError ? mutation.error.response.data.message.recipientError : false}
							onChange={(e) => setRecipient(e.target.value)}
							value={recipient}
							inputProps={{
								minLength : 4,
								maxLength : 20
							}}
							size="medium"
							id="recipient"
							name="recipient"
							label="Username of recipient"
							type="text"
							disabled={recipientUsername ? true : false}
							fullWidth
							required
						/>

						<Input
							sx={{ minHeight: '90px' }}
							error={mutation.isError && mutation.error.response.data.message.subjectError ? true : false}
							helperText={mutation.isError ? mutation.error.response.data.message.subjectError : false}
							onChange={(e) => setSubject(e.target.value)}
							value={subject}
							inputProps={{
								minLength : 1,
								maxLength : 60
							}}
							size="medium"
							id="subject"
							name="subject"
							label={`Subject (${subject.length}/60)`}
							type="text"
							fullWidth
							required
						/>

						<Input
							error={mutation.isError && mutation.error.response.data.message.messageError ? true : false}
							helperText={mutation.isError ? mutation.error.response.data.message.messageError : false}
							onChange={(e) => setMessage(e.target.value)}
							value={message}
							inputProps={{
								minLength : 1,
								maxLength : 500
							}}
							id="message"
							name="message"
							label={`Message (${message.length}/500)`}
							type="text"
							size="medium"
							multiline
							minRows={3}
							maxRows={10}
							fullWidth
							required
						/>
					</DialogContent>

					<Divider />

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
