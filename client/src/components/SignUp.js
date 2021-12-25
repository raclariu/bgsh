// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

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
import { signUp } from '../actions/userActions'

const PREFIX = 'SignUp'

const classes = {
	root  : `${PREFIX}-root`,
	input : `${PREFIX}-input`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.root}`]: {
		width  : '100%',
		margin : theme.spacing(4, 0, 0, 0)
	},

	[`& .${classes.input}`]: {
		minHeight : '90px'
	}
}))

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
		<Root>
			<form onSubmit={submitHandler} className={classes.root} autoComplete="off">
				<Input
					className={classes.input}
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
					className={classes.input}
					error={error && error.usernameError ? true : false}
					helperText={error ? error.usernameError : false}
					onChange={(e) => setUsername(e.target.value)}
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
					className={classes.input}
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

				<Input
					className={classes.input}
					error={error && error.passwordConfirmationError ? true : false}
					helperText={error ? error.passwordConfirmationError : false}
					onChange={(e) => setPasswordConfirmation(e.target.value)}
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
								<IconButton
									onClick={() => setPassConfirmationVisibility(!passConfirmationVisibility)}
									size="large"
								>
									{passConfirmationVisibility ? (
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
		</Root>
	)
}

export default SignUp
