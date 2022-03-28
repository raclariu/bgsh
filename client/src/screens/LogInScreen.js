// @ Modules
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation } from 'react-query'
import { useHistory, useLocation, useParams, Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Backdrop from '@mui/material/Backdrop'

// @ Icons
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import Loader from '../components/Loader'
import CustomIconBtn from '../components/CustomIconBtn'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import { logIn } from '../actions/userActions'
import { useNotiSnackbar } from '../hooks/hooks'
import { apiActivateAccount, apiUserLogin } from '../api/api'

// @ Main
const LogIn = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()
	const params = useParams()
	const [ showSnackbar ] = useNotiSnackbar()

	const { tokenUid } = params
	const isActivationPage = location.pathname !== '/login' && location.pathname.startsWith('/activate') && !!tokenUid

	const [ email, setEmail ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)

	const userAuth = useSelector((state) => state.userAuth)
	const { userData } = userAuth

	const { isLoading } = useQuery([ 'activate' ], () => apiActivateAccount(tokenUid), {
		staleTime : Infinity,
		retry     : 0,
		enabled   : isActivationPage,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while activating account'
			showSnackbar.error({ text })
			if (userData) {
				history.replace('/collection')
			} else {
				history.replace('/login')
			}
		},
		onSuccess : () => {
			showSnackbar.success({ text: 'Account successfully activated. Use your credentials to log in' })
			history.replace('/login')
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
				console.log(location.state)
				location.state && location.state.from && location.state.from.pathname
					? history.replace(`${location.state.from.pathname}`)
					: history.replace('/')
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
				<form onSubmit={submitHandler} autoComplete="off" style={{ height: '100%' }}>
					<Helmet title="Log in" />

					<Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={3}>
						<CustomIconBtn color="primary" onClick={() => history.push('/')} size="large" edge="start">
							<HomeTwoToneIcon />
						</CustomIconBtn>
						<Box color="primary.main" fontWeight="fontWeightMedium" fontSize={22}>
							Log In
						</Box>
					</Box>

					<Box display="flex" alignItems="center" flexDirection="column" justifyContent="center">
						<Input
							sx={{ minHeight: '90px' }}
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
										<CustomIconBtn onClick={() => setPassVisibility(!passVisibility)} size="large">
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

						<Box display="flex" justifyContent="right" mt={2} fontSize={12}>
							<Link component={RouterLink} to="/create-account" underline="none">
								Create account
							</Link>
						</Box>
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
			</Grid>
		</Grid>
	)
}

export default LogIn
