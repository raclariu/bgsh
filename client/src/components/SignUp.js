// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'

// @ Icons
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined'

// @ Components
import Loader from './Loader'

// @ Others
import { signUp } from '../actions/userActions'

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
const SignUp = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ email, setEmail ] = useState('')
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passwordConfirmation, setPasswordConfirmation ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)
	const [ passConfirmationVisibility, setPassConfirmationVisibility ] = useState(false)

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

	const handleShowHidePass = () => {
		setPassVisibility(!passVisibility)
	}

	const handleShowHidePassConfirmation = () => {
		setPassConfirmationVisibility(!passConfirmationVisibility)
	}

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(signUp(email, username, password, passwordConfirmation))
	}

	return (
		<Fragment>
			<form onSubmit={submitHandler} className={classes.root} autoComplete="off">
				<TextField
					className={classes.input}
					error={error && error.emailError ? true : false}
					helperText={error ? error.emailError : false}
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					variant="outlined"
					id="email"
					name="email"
					label="Email"
					type="email"
					fullWidth
					autoFocus
					required
				/>

				<TextField
					className={classes.input}
					error={error && error.usernameError ? true : false}
					helperText={error ? error.usernameError : false}
					onChange={(e) => setUsername(e.target.value)}
					value={username}
					variant="outlined"
					id="username"
					name="username"
					label="Username"
					type="text"
					fullWidth
					required
				/>

				<TextField
					className={classes.input}
					error={error && error.passwordError ? true : false}
					helperText={error ? error.passwordError : false}
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					variant="outlined"
					id="password"
					name="password"
					label="Password"
					type={passVisibility ? 'text' : 'password'}
					InputProps={{
						endAdornment : (
							<InputAdornment position="end">
								<IconButton onClick={handleShowHidePass}>
									{passVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
								</IconButton>
							</InputAdornment>
						)
					}}
					fullWidth
					required
				/>

				<TextField
					className={classes.input}
					error={error && error.passwordConfirmationError ? true : false}
					helperText={error ? error.passwordConfirmationError : false}
					onChange={(e) => setPasswordConfirmation(e.target.value)}
					value={passwordConfirmation}
					variant="outlined"
					id="passwordConfirmation"
					name="passwordConfirmation"
					label="Confirm Password"
					type={passConfirmationVisibility ? 'text' : 'password'}
					InputProps={{
						endAdornment : (
							<InputAdornment position="end">
								<IconButton onClick={handleShowHidePassConfirmation}>
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
		</Fragment>
	)
}

export default SignUp
