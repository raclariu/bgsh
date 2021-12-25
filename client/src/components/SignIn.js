// @ Libraries
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles';

// @ Mui
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import Loader from './Loader'
import Input from './Input'

// @ Others
import { signIn } from '../actions/userActions'
import { useNotification } from '../hooks/hooks'

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

// @ Main
const SignIn = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()
	console.log(location)

	const [ email, setEmail ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)
	const [ showSnackbar ] = useNotification()

	const userAuth = useSelector((state) => state.userAuth)
	const { loading, error, success, userData } = userAuth

	useEffect(
		() => {
			if (userData) {
				location.state && location.state.from && location.state.from.pathname
					? history.push(`${location.state.from.pathname}`)
					: history.push('/profile')
			}
		},
		[ history, userData, location ]
	)

	useEffect(
		() => {
			if (success && userData) {
				showSnackbar.success({ text: `You are now logged in as 👉 ${userData.username}` })
			}
		},
		[ success, showSnackbar, userData ]
	)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(signIn(email, password))
	}

	return (
        <form onSubmit={submitHandler} className={cls.root} autoComplete="off">
			<Input
				className={cls.input}
				error={error && error.emailError ? true : false}
				helperText={error ? error.emailError : false}
				onChange={(e) => setEmail(e.target.value)}
				value={email}
				size="medium"
				id="email"
				name="email"
				label="Email"
				type="email"
				fullWidth
				autoFocus
				required
			/>

			<Input
				className={cls.input}
				error={error && error.passwordError ? true : false}
				helperText={error ? error.passwordError : false}
				onChange={(e) => setPassword(e.target.value)}
				value={password}
				size="medium"
				id="password"
				name="password"
				label="Password"
				type={passVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<IconButton onClick={() => setPassVisibility(!passVisibility)} size="large">
								{passVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
							</IconButton>
						</InputAdornment>
					)
				}}
				fullWidth
				required
			/>

			<Button type="submit" variant="contained" color="primary" size="large" disabled={loading} fullWidth>
				{loading ? <Loader size={26} color="inherit" /> : 'Sign In'}
			</Button>
		</form>
    );
}

export default SignIn
