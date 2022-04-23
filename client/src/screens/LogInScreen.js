// @ Modules
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation } from 'react-query'
import { useNavigate, useLocation, useParams, Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Backdrop from '@mui/material/Backdrop'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// @ Icons
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import Loader from '../components/Loader'
import CustomIconBtn from '../components/CustomIconBtn'
import Input from '../components/Input'
import CustomButton from '../components/CustomButton'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import { logIn } from '../actions/userActions'
import { useNotiSnackbar } from '../hooks/hooks'
import { apiActivateAccount, apiUserLogin, apiForgotPasswordRequest } from '../api/api'

// @ Forgot password dialog
const ForgotPasswordDialog = () => {
	const [ showSnackbar ] = useNotiSnackbar()

	const [ open, setOpen ] = useState(false)
	const [ email, setEmail ] = useState('')

	const { mutate, isError, error, isLoading } = useMutation((email) => apiForgotPasswordRequest(email), {
		onError   : (err) => {
			if (err.response.data.code === 14) {
				showSnackbar.error({ text: err.response.data.message })
			}
			return
		},
		onSuccess : (data, email) => {
			setOpen(false)
			setEmail('')
			showSnackbar.success({
				text             : `A reset email was sent to ${email}`,
				preventDuplicate : true
			})
			showSnackbar.info({
				text             : "It may take a few minutes. Don't forget to check your spam folder",
				preventDuplicate : true
			})
		}
	})

	const handleDialogClose = () => {
		setOpen(false)
	}

	const handleDialogOpen = () => {
		setOpen(true)
	}

	const submitHandler = (e) => {
		e.preventDefault()
		mutate(email)
	}

	return (
		<Fragment>
			<Link sx={{ cursor: 'pointer' }} onClick={handleDialogOpen} underline="none">
				Forgot your password?
			</Link>

			<Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
				<form onSubmit={submitHandler} autoComplete="off">
					<DialogTitle>
						<Box textAlign="center">Enter your email address</Box>
						<Box textAlign="center" mt={1} color="text.secondary" fontSize="subtitle2.fontSize">
							An email will be sent to your email address containing instructions on how to reset your
							password
						</Box>
					</DialogTitle>

					<DialogContent dividers>
						<Input
							error={
								isError && error.response.data.message ? error.response.data.message.emailError : false
							}
							helperText={
								isError && error.response.data.message ? error.response.data.message.emailError : false
							}
							onChange={(inputVal) => setEmail(inputVal)}
							value={email}
							size="medium"
							id="email"
							name="email"
							label="Your email address"
							type="email"
							fullWidth
							autoFocus
							required
						/>
					</DialogContent>

					<DialogActions>
						<CustomButton onClick={handleDialogClose}>Cancel</CustomButton>
						<LoadingBtn type="submit" loading={isLoading} variant="contained">
							Send email
						</LoadingBtn>
					</DialogActions>
				</form>
			</Dialog>
		</Fragment>
	)
}

// @ Main
const LogIn = ({ isActivationPage }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const params = useParams()
	const [ showSnackbar ] = useNotiSnackbar()

	const { tokenUid } = params

	const [ email, setEmail ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)

	const { success } = useSelector((state) => state.userData)

	useEffect(
		() => {
			if (success) {
				navigate('/dashboard', { replace: true })
			}
		},
		[ navigate, success ]
	)

	const { isLoading } = useQuery([ 'activate' ], () => apiActivateAccount(tokenUid), {
		staleTime : Infinity,
		retry     : 0,
		enabled   : isActivationPage,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while activating account'

			if (success) {
				navigate('/dashboard', { replace: true })
			} else {
				showSnackbar.error({ text })
				navigate('/login', { replace: true })
			}
		},
		onSuccess : () => {
			showSnackbar.success({ text: 'Account successfully activated. Use your credentials to log in' })
			navigate('/login', { replace: true })
		}
	})

	const { isLoading: isLoadingLogin, isError, mutate, error } = useMutation(
		(credentials) => apiUserLogin(credentials),
		{
			retry     : 0,
			onError   : (err) => {
				if (err.response.data.code === 11) {
					showSnackbar.error({ text: err.response.data.message })
				}
				return
			},
			onSuccess : (data) => {
				dispatch(logIn(data))
				showSnackbar.success({ text: 'You are now logged in' })

				location.state && location.state.from && location.state.from !== '/'
					? navigate(`${location.state.from}`, { replace: true })
					: navigate('/', { replace: true })
			}
		}
	)

	const submitHandler = (e) => {
		e.preventDefault()
		mutate({ email, password })
	}

	let usernameErrorMsg = isError && error.response.data.code === 10 ? error.response.data.message.emailError : false
	let pwErrorMsg = isError && error.response.data.code === 10 ? error.response.data.message.passwordError : false

	return (
		<Grid container justifyContent="center" alignItems="center" height="100%" sx={{ flex: 1 }}>
			<Grid item xs={12} sm={8} md={6}>
				<form onSubmit={submitHandler} autoComplete="on" style={{ height: '100%' }}>
					<Helmet title="Log in" />

					<Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={3}>
						<CustomIconBtn color="primary" onClick={() => navigate('/')} size="large" edge="start">
							<HomeTwoToneIcon />
						</CustomIconBtn>
						<Box color="primary.main" fontWeight="fontWeightMedium" fontSize="h5.fontSize">
							Log In
						</Box>
					</Box>

					<Box display="flex" alignItems="center" flexDirection="column" justifyContent="center">
						<Input
							sx={{ minHeight: '90px' }}
							autoComplete="email"
							error={!!usernameErrorMsg}
							helperText={usernameErrorMsg}
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
							autoComplete="current-password"
							error={!!pwErrorMsg}
							helperText={pwErrorMsg}
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
										<CustomIconBtn onClick={() => setPassVisibility(!passVisibility)}>
											{passVisibility ? (
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

						<LoadingBtn
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							loading={isLoadingLogin}
							fullWidth
						>
							Log In
						</LoadingBtn>
					</Box>

					<Backdrop sx={{ zIndex: 1000 }} open={isLoading}>
						<Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={4}>
							<Loader />

							<Box fontWeight="fontWeightMedium" fontSize="h6.fontSize">
								Activating your account...
							</Box>
						</Box>
					</Backdrop>
				</form>

				<Box display="flex" justifyContent="space-between" width="100%" mt={2} fontSize={12}>
					<ForgotPasswordDialog />
					<Link component={RouterLink} to="/create-account" underline="none">
						Don't have an account?
					</Link>
				</Box>
			</Grid>
		</Grid>
	)
}

export default LogIn
