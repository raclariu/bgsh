// @ Libraries
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { useHistory, useLocation, useParams, Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
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

// @ Others
import { logIn } from '../actions/userActions'
import { useNotiSnackbar } from '../hooks/hooks'
import { apiActivateAccount } from '../api/api'

// @ Main
const LogIn = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()
	const params = useParams()
	const [ showSnackbar ] = useNotiSnackbar()

	console.log(location)

	const { tokenUid } = params
	const isActivationPage = location.pathname !== '/login' && location.pathname.startsWith('/activate') && !!tokenUid
	console.log(isActivationPage)

	const [ email, setEmail ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)

	const userAuth = useSelector((state) => state.userAuth)
	const { loading, error, success, userData } = userAuth

	const { isLoading, isError } = useQuery([ 'activate' ], () => apiActivateAccount(tokenUid), {
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

	useEffect(
		() => {
			if (userData && !isActivationPage) {
				location.state && location.state.from && location.state.from.pathname
					? history.replace(`${location.state.from.pathname}`)
					: history.replace('/')
			}
		},
		[ history, userData, location, isActivationPage ]
	)

	useEffect(
		() => {
			if (success && userData) {
				showSnackbar.success({ text: `You are now logged in as ${userData.username}` })
			}
		},
		[ success, showSnackbar, userData ]
	)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(logIn(email, password))
	}

	return (
		<form onSubmit={submitHandler} autoComplete="off">
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

				<LoadingBtn type="submit" variant="contained" color="primary" size="large" loading={loading} fullWidth>
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
	)
}

export default LogIn
