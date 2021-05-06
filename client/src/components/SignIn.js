import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { signIn } from '../actions/userActions'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
	root  : {
		width  : '100%',
		margin : theme.spacing(4, 0, 0, 0)
	},
	input : {
		minHeight : '95px'
	}
}))

const SignIn = () => {
	const classes = useStyles()
	const history = useHistory()

	const [ email, setEmail ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)

	const dispatch = useDispatch()

	const userSignIn = useSelector((state) => state.userSignIn)
	const { loading, error, userInfo } = userSignIn

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
		dispatch(signIn(email, password))
	}

	const handleShowHidePass = () => {
		setPassVisibility(!passVisibility)
	}

	return (
		<Fragment>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					className={classes.input}
					error={error && error.errors.emailError ? true : false}
					helperText={error ? error.errors.emailError : false}
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
					error={error && error.errors.passwordError ? true : false}
					helperText={error ? error.errors.passwordError : false}
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					variant="outlined"
					id="password"
					name="password"
					label="Password"
					type={passVisibility ? 'text' : 'password'}
					InputProps={{
						endAdornment : (
							<IconButton onClick={handleShowHidePass} size="small" edge="end">
								{passVisibility ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						)
					}}
					fullWidth
					required
				/>

				<Button
					onClick={submitHandler}
					type="submit"
					variant="contained"
					color="primary"
					size="large"
					disabled={loading}
					fullWidth
				>
					{loading ? <Loader size={26} color="inherit" /> : 'Sign In'}
				</Button>
			</form>
		</Fragment>
	)
}

export default SignIn
