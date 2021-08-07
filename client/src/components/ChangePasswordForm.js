import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined'

import Loader from './Loader'

import { changePassword } from '../actions/userActions'

const useStyles = makeStyles((theme) => ({
	form  : {
		width  : '100%',
		margin : theme.spacing(4, 0, 0, 0)
	},
	input : {
		minHeight : '90px'
	}
}))

const ChangePasswordForm = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ passwordCurrent, setPasswordCurrent ] = useState('')
	const [ passwordNew, setPasswordNew ] = useState('')
	const [ passwordNewConfirmation, setPasswordNewConfirmation ] = useState('')
	const [ passCurrentVisibility, setPassCurrentVisibility ] = useState(false)
	const [ passNewVisibility, setPassNewVisibility ] = useState(false)
	const [ passNewConfirmationVisibility, setPassNewConfirmationVisibility ] = useState(false)

	const changePass = useSelector((state) => state.changePassword)
	const { loading, success, error } = changePass

	useEffect(
		() => {
			if (success) {
				setPasswordCurrent('')
				setPasswordNew('')
				setPasswordNewConfirmation('')
			}
		},
		[ success ]
	)

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
		dispatch(changePassword(passwordCurrent, passwordNew, passwordNewConfirmation))
	}

	return (
		<Fragment>
			<form onSubmit={submitHandler} className={cls.form} autoComplete="off">
				<TextField
					className={cls.input}
					error={error && error.passwordCurrentError ? true : false}
					helperText={error ? error.passwordCurrentError : false}
					onChange={(e) => setPasswordCurrent(e.target.value)}
					value={passwordCurrent}
					variant="outlined"
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

				<TextField
					className={cls.input}
					error={error && error.passwordNewError ? true : false}
					helperText={error ? error.passwordNewError : false}
					onChange={(e) => setPasswordNew(e.target.value)}
					value={passwordNew}
					variant="outlined"
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

				<TextField
					className={cls.input}
					error={error && error.passwordNewConfirmationError ? true : false}
					helperText={error ? error.passwordNewConfirmationError : false}
					onChange={(e) => setPasswordNewConfirmation(e.target.value)}
					value={passwordNewConfirmation}
					variant="outlined"
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

				<Button variant="contained" type="submit" color="primary" size="large" disabled={loading} fullWidth>
					{loading ? <Loader size={26} color="inherit" /> : 'Sign up'}
				</Button>
			</form>
		</Fragment>
	)
}

export default ChangePasswordForm