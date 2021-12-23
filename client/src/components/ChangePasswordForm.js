// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation, useQueryClient } from 'react-query'

// @ Mui
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import Box from '@material-ui/core/Box'

// @ Icons
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined'

// @ Components
import Loader from './Loader'
import CustomAlert from '../components/CustomAlert'
import Input from './Input'

// @ Others
import { changePassword } from '../actions/userActions'
import { USER_CHANGE_PASSWORD_RESET } from '../constants/userConstants'
import { useNotification } from '../hooks/hooks'
import { apiUserChangePassword } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	input : {
		minHeight : '90px'
	}
}))

// @ Main
const ChangePasswordForm = () => {
	const cls = useStyles()

	const [ passwordCurrent, setPasswordCurrent ] = useState('')
	const [ passwordNew, setPasswordNew ] = useState('')
	const [ passwordNewConfirmation, setPasswordNewConfirmation ] = useState('')
	const [ passCurrentVisibility, setPassCurrentVisibility ] = useState(false)
	const [ passNewVisibility, setPassNewVisibility ] = useState(false)
	const [ passNewConfirmationVisibility, setPassNewConfirmationVisibility ] = useState(false)
	const [ showSnackbar ] = useNotification()

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
		<Fragment>
			<form onSubmit={submitHandler} autoComplete="off">
				<Input
					className={cls.input}
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
								<IconButton onClick={() => handlePassVisibility('passCurrent')}>
									{passCurrentVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
								</IconButton>
							</InputAdornment>
						)
					}}
					fullWidth
					required
				/>

				<Input
					className={cls.input}
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
								<IconButton onClick={() => handlePassVisibility('passNew')}>
									{passNewVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
								</IconButton>
							</InputAdornment>
						)
					}}
					fullWidth
					required
				/>

				<Input
					className={cls.input}
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
								<IconButton onClick={() => handlePassVisibility('passNewConfirmation')}>
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
					<Button variant="contained" type="submit" color="primary" size="large" disabled={isLoading}>
						{isLoading ? <Loader size={26} color="inherit" /> : 'Change password'}
					</Button>
				</Box>
			</form>
		</Fragment>
	)
}

export default ChangePasswordForm
