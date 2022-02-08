// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link as RouterLink } from 'react-router-dom'

// @ Mui
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

// @ Icons
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import LoadingBtn from './LoadingBtn'
import Input from './Input'

// @ Others
import { signUp } from '../actions/userActions'

// @ Main
const SignUp = () => {
	const dispatch = useDispatch()
	const history = useHistory()

	const [ email, setEmail ] = useState('')
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passwordConfirmation, setPasswordConfirmation ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)
	const [ passConfirmationVisibility, setPassConfirmationVisibility ] = useState(false)

	const userAuth = useSelector((state) => state.userAuth)
	const { loading, error, userData } = userAuth

	useEffect(
		() => {
			if (userData) {
				history.push('/collection')
			}
		},
		[ history, userData ]
	)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(signUp(email, username, password, passwordConfirmation))
	}

	return (
		<form onSubmit={submitHandler} autoComplete="off">
			<Input
				sx={{ minHeight: '90px' }}
				error={error && error.emailError ? true : false}
				helperText={error ? error.emailError : false}
				onChange={(inputVal) => setEmail(inputVal)}
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
				sx={{ minHeight: '90px' }}
				error={error && error.usernameError ? true : false}
				helperText={error ? error.usernameError : false}
				onChange={(inputVal) => setUsername(inputVal)}
				value={username}
				size="medium"
				id="username"
				name="username"
				label="Username"
				type="text"
				fullWidth
				required
			/>

			<Input
				sx={{ minHeight: '90px' }}
				error={error && error.passwordError ? true : false}
				helperText={error ? error.passwordError : false}
				onChange={(inputVal) => setPassword(inputVal)}
				value={password}
				size="medium"
				id="password"
				name="password"
				label="Password"
				type={passVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<CustomIconBtn onClick={() => setPassVisibility(!passVisibility)} size="large">
								{passVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
							</CustomIconBtn>
						</InputAdornment>
					)
				}}
				fullWidth
				required
			/>

			<Input
				sx={{ minHeight: '90px' }}
				error={error && error.passwordConfirmationError ? true : false}
				helperText={error ? error.passwordConfirmationError : false}
				onChange={(inputVal) => setPasswordConfirmation(inputVal)}
				value={passwordConfirmation}
				size="medium"
				variant="outlined"
				id="passwordConfirmation"
				name="passwordConfirmation"
				label="Confirm Password"
				type={passConfirmationVisibility ? 'text' : 'password'}
				InputProps={{
					endAdornment : (
						<InputAdornment position="end">
							<CustomIconBtn
								onClick={() => setPassConfirmationVisibility(!passConfirmationVisibility)}
								size="large"
							>
								{passConfirmationVisibility ? (
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

			<LoadingBtn type="submit" variant="contained" color="primary" size="large" loading={loading} fullWidth>
				Sign up
			</LoadingBtn>

			<Box display="flex" justifyContent="right" mt={2} fontSize={12}>
				<Link component={RouterLink} to="/signin" underline="none">
					Already have an account?
				</Link>
			</Box>
		</form>
	)
}

export default SignUp
