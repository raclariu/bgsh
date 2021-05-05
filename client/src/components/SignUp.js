import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { signUp } from '../actions/userActions'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
	root       : {
		width  : '100%',
		margin : theme.spacing(4, 0, 0, 0)
	},
	input      : {
		margin : theme.spacing(4, 0, 0, 0)
	},
	submitBtn  : {
		margin : theme.spacing(4, 0, 0, 0)
	},
	typography : {
		margin : theme.spacing(4, 0, 0, 0)
	}
}))

const SignUp = () => {
	const classes = useStyles()
	const history = useHistory()

	const [ email, setEmail ] = useState('')
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passwordConfirmation, setPasswordConfirmation ] = useState('')

	const dispatch = useDispatch()

	const userSignUp = useSelector((state) => state.userSignUp)
	const { loading, error } = userSignUp

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	useEffect(
		() => {
			if (userInfo) {
				history.push('/collection')
			}
		},
		[ history, userInfo ]
	)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(signUp(email, username, password, passwordConfirmation))
	}

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<form className={classes.root} noValidate autoComplete="off">
						<TextField
							error={error && error.errors.emailError ? true : false}
							helperText={error ? error.errors.emailError : false}
							onChange={(e) => setEmail(e.target.value)}
							variant="outlined"
							value={email}
							id="email"
							label="Email"
							type="email"
							fullWidth
							required
						/>

						<TextField
							className={classes.input}
							error={error && error.errors.usernameError ? true : false}
							helperText={error ? error.errors.usernameError : false}
							onChange={(e) => setUsername(e.target.value)}
							variant="outlined"
							value={username}
							id="username"
							label="Username"
							type="text"
							fullWidth
							autoFocus
							required
						/>

						<TextField
							className={classes.input}
							error={error && error.errors.passwordError ? true : false}
							helperText={error ? error.errors.passwordError : false}
							onChange={(e) => setPassword(e.target.value)}
							variant="outlined"
							value={password}
							id="password"
							label="Password"
							type="password"
							fullWidth
							required
						/>

						<TextField
							className={classes.input}
							error={error && error.errors.passwordConfirmationError ? true : false}
							helperText={error ? error.errors.passwordConfirmationError : false}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							variant="outlined"
							value={passwordConfirmation}
							id="passwordConfirmation"
							label="Password Confirmation"
							type="password"
							fullWidth
							required
						/>

						<Button
							className={classes.submitBtn}
							onClick={submitHandler}
							variant="contained"
							type="submit"
							color="primary"
							size="large"
							fullWidth
						>
							Sign Up
						</Button>
					</form>
				</Fragment>
			)}
		</Fragment>
	)
}

export default SignUp
