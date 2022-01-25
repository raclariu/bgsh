// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from 'react-query'

// @ Mui
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

// @ Icons
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import Loader from './Loader'
import CustomAlert from '../components/CustomAlert'
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import { changePassword } from '../actions/userActions'
import { USER_CHANGE_PASSWORD_RESET } from '../constants/userConstants'
import { useNotiSnackbar } from '../hooks/hooks'
import { apiUserChangePassword } from '../api/api'

// @ Main
const ChangePasswordForm = () => {
	const [ passwordCurrent, setPasswordCurrent ] = useState('')
	const [ passwordNew, setPasswordNew ] = useState('')
	const [ passwordNewConfirmation, setPasswordNewConfirmation ] = useState('')
	const [ passCurrentVisibility, setPassCurrentVisibility ] = useState(false)
	const [ passNewVisibility, setPassNewVisibility ] = useState(false)
	const [ passNewConfirmationVisibility, setPassNewConfirmationVisibility ] = useState(false)
	const [ showSnackbar ] = useNotiSnackbar()

	const { isLoading, mutate, isError, error, isSuccess } = useMutation(
		({ passwordCurrent, passwordNew, passwordNewConfirmation }) =>
			apiUserChangePassword({ passwordCurrent, passwordNew, passwordNewConfirmation }),
		{
			onSuccess : () => {
				setPasswordCurrent('')
				setPasswordNew('')
				setPasswordNewConfirmation('')
				showSnackbar.success({ text: 'Password changed successfully' })
			}
		}
	)

	const passwordCurrentErrorMsg = isError && error.response && error.response.data.message.passwordCurrentError
	const passwordNewErrorMsg = isError && error.response && error.response.data.message.passwordNewError
	const passwordNewConfirmationErrorMsg =
		isError && error.response && error.response.data.message.passwordNewConfirmationError

	const handlePassVisibility = (type) => {
		if (type === 'passCurrent') {
			setPassCurrentVisibility(!passCurrentVisibility)
		}

		if (type === 'passNew') {
			setPassNewVisibility(!passNewVisibility)
		}

		if (type === 'passNewConfirmation') {
			setPassNewConfirmationVisibility(!passNewConfirmationVisibility)
		}
	}

	const submitHandler = (e) => {
		e.preventDefault()
		mutate({ passwordCurrent, passwordNew, passwordNewConfirmation })
	}

	return (
		<form onSubmit={submitHandler} autoComplete="off">
			<Input
				sx={{ minHeight: '90px' }}
				error={isError && passwordCurrentErrorMsg ? true : false}
				helperText={isError ? passwordCurrentErrorMsg : false}
				onChange={(e) => setPasswordCurrent(e.target.value)}
				value={passwordCurrent}
				size="medium"
				id="passwordCurrent"
				name="passwordCurrent"
				label="Current Password"
				type={passCurrentVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<IconButton onClick={() => handlePassVisibility('passCurrent')} size="large">
								{passCurrentVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
							</IconButton>
						</InputAdornment>
					)
				}}
				fullWidth
				required
			/>

			<Input
				sx={{ minHeight: '90px' }}
				error={isError && passwordNewErrorMsg ? true : false}
				helperText={isError ? passwordNewErrorMsg : false}
				onChange={(e) => setPasswordNew(e.target.value)}
				value={passwordNew}
				size="medium"
				id="passwordNew"
				name="passwordNew"
				label="New Password"
				type={passNewVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<IconButton onClick={() => handlePassVisibility('passNew')} size="large">
								{passNewVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
							</IconButton>
						</InputAdornment>
					)
				}}
				fullWidth
				required
			/>

			<Input
				sx={{ minHeight: '90px' }}
				error={isError && passwordNewConfirmationErrorMsg ? true : false}
				helperText={isError ? passwordNewConfirmationErrorMsg : false}
				onChange={(e) => setPasswordNewConfirmation(e.target.value)}
				value={passwordNewConfirmation}
				size="medium"
				id="passwordNewConfirmation"
				name="passwordNewConfirmation"
				label="Confirm New Password"
				type={passNewConfirmationVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<IconButton onClick={() => handlePassVisibility('passNewConfirmation')} size="large">
								{passNewConfirmationVisibility ? (
									<VisibilityOutlinedIcon />
								) : (
									<VisibilityOffOutlinedIcon />
								)}
							</IconButton>
						</InputAdornment>
					)
				}}
				fullWidth
				required
			/>

			<Box display="flex" justifyContent="flex-end">
				<LoadingBtn variant="outlined" type="submit" color="primary" size="large" loading={isLoading}>
					Change password
				</LoadingBtn>
			</Box>
		</form>
	)
}

export default ChangePasswordForm
