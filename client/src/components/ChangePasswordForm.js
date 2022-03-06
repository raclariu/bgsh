// @ Modules
import React, { useState } from 'react'

// @ Mui
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

// @ Icons
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import { useNotiSnackbar, useChangePasswordMutation } from '../hooks/hooks'

// @ Main
const ChangePasswordForm = () => {
	const [ passwordCurrent, setPasswordCurrent ] = useState('')
	const [ passwordNew, setPasswordNew ] = useState('')
	const [ passwordNewConfirmation, setPasswordNewConfirmation ] = useState('')
	const [ passCurrentVisibility, setPassCurrentVisibility ] = useState(false)
	const [ passNewVisibility, setPassNewVisibility ] = useState(false)
	const [ passNewConfirmationVisibility, setPassNewConfirmationVisibility ] = useState(false)

	const { isLoading, mutate, isError, error } = useChangePasswordMutation({
		resetForm : () => {
			setPasswordCurrent('')
			setPasswordNew('')
			setPasswordNewConfirmation('')
		}
	})

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
				onChange={(inputVal) => setPasswordCurrent(inputVal)}
				value={passwordCurrent}
				size="medium"
				id="passwordCurrent"
				name="passwordCurrent"
				label="Current Password"
				type={passCurrentVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<CustomIconBtn onClick={() => handlePassVisibility('passCurrent')} size="large">
								{passCurrentVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
							</CustomIconBtn>
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
				onChange={(inputVal) => setPasswordNew(inputVal)}
				value={passwordNew}
				size="medium"
				id="passwordNew"
				name="passwordNew"
				label="New Password"
				type={passNewVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<CustomIconBtn onClick={() => handlePassVisibility('passNew')} size="large">
								{passNewVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
							</CustomIconBtn>
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
				onChange={(inputVal) => setPasswordNewConfirmation(inputVal)}
				value={passwordNewConfirmation}
				size="medium"
				id="passwordNewConfirmation"
				name="passwordNewConfirmation"
				label="Confirm New Password"
				type={passNewConfirmationVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<CustomIconBtn onClick={() => handlePassVisibility('passNewConfirmation')} size="large">
								{passNewConfirmationVisibility ? (
									<VisibilityOutlinedIcon />
								) : (
									<VisibilityOffOutlinedIcon />
								)}
							</CustomIconBtn>
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
