import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { signIn } from '../actions/userActions'
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

const SignInScreen = ({ history }) => {
	const classes = useStyles()

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
		[ error, userInfo, history ]
	)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(signIn(email, password))
	}

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<Typography className={classes.typography} align="center" variant="h4">
						Sign In
					</Typography>
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

						<Button
							className={classes.submitBtn}
							onClick={submitHandler}
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							fullWidth
						>
							Sign In
						</Button>
					</form>
				</Fragment>
			)}
		</Fragment>
	)
}

export default SignInScreen
