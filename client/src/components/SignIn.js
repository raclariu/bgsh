import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
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

	return (
		<Fragment>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					className={classes.input}
					error={error && error.errors.emailError ? true : false}
					helperText={error ? error.errors.emailError : false}
					onChange={(e) => setEmail(e.target.value)}
					variant="outlined"
					value={email}
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
					variant="outlined"
					value={password}
					id="password"
					name="password"
					label="Password"
					type="password"
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

// * de facut ochi pentru parola
