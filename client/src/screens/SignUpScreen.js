import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { signUp } from '../actions/userActions'
import Loader from '../components/Loader'

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

const SignUpScreen = ({ history }) => {
	const classes = useStyles()

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
		[ error, userInfo, history ]
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
					<Typography className={classes.typography} align="center" variant="h4">
						Sign Up
					</Typography>

					<form className={classes.root} noValidate autoComplete="off">
						<TextField
							className={classes.input}
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

export default SignUpScreen
