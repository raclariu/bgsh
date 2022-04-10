// @ Modules
import React, { Fragment, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

// @ Icons
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import CustomIconBtn from '../components/CustomIconBtn'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import { useNotiSnackbar } from '../hooks/hooks'
import { apiCreateAccount } from '../api/api'

// @ Main
const CreateAccountScreen = () => {
	const navigate = useNavigate()
	const [ showSnackbar ] = useNotiSnackbar()

	const { success } = useSelector((state) => state.userData)

	useEffect(
		() => {
			if (success) {
				navigate('/collection', { replace: true })
			}
		},
		[ navigate, success ]
	)

	const [ email, setEmail ] = useState('')
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ passwordConfirmation, setPasswordConfirmation ] = useState('')
	const [ passVisibility, setPassVisibility ] = useState(false)
	const [ passConfirmationVisibility, setPassConfirmationVisibility ] = useState(false)

	const { mutate, isError, error, isLoading } = useMutation((data) => apiCreateAccount(data), {
		onSuccess : (data, vars) => {
			showSnackbar.success({
				text             : `Account created successfully. An activation email was sent to ${vars.email}`,
				preventDuplicate : true
			})
			showSnackbar.info({
				text             : "It may take a few minutes. Don't forget to check your spam folder",
				preventDuplicate : true
			})
			navigate('/login')
		}
	})

	const submitHandler = (e) => {
		e.preventDefault()
		mutate({ email, username, password, passwordConfirmation })
	}

	return (
		<Grid container justifyContent="center" alignItems="center" height="100%" sx={{ flex: 1 }}>
			<Grid item xs={12} sm={8} md={6}>
				<form onSubmit={submitHandler} autoComplete="off">
					<Helmet title="Create an account" />
					<Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={3}>
						<CustomIconBtn color="primary" onClick={() => navigate('/')} size="large" edge="start">
							<HomeTwoToneIcon />
						</CustomIconBtn>
						<Box color="primary.main" fontWeight="fontWeightMedium" fontSize="h5.fontSize">
							Create account
						</Box>
					</Box>

					<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
						<Input
							sx={{ minHeight: '90px' }}
							error={isError && error.response.data.message.emailError ? true : false}
							helperText={isError ? error.response.data.message.emailError : false}
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
							error={isError && error.response.data.message.usernameError ? true : false}
							helperText={isError ? error.response.data.message.usernameError : false}
							onChange={(inputVal) => setUsername(inputVal)}
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
							sx={{ minHeight: '90px' }}
							error={isError && error.response.data.message.passwordError ? true : false}
							helperText={isError ? error.response.data.message.passwordError : false}
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

						<Input
							sx={{ minHeight: '90px' }}
							error={isError && error.response.data.message.passwordConfirmationError ? true : false}
							helperText={isError ? error.response.data.message.passwordConfirmationError : false}
							onChange={(inputVal) => setPasswordConfirmation(inputVal)}
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
										<CustomIconBtn
											onClick={() => setPassConfirmationVisibility(!passConfirmationVisibility)}
										>
											{passConfirmationVisibility ? (
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
							loading={isLoading}
							fullWidth
						>
							Create account
						</LoadingBtn>

						<Box display="flex" justifyContent="right" width="100%" mt={2} fontSize={12}>
							<Link component={RouterLink} to="/login" underline="none">
								Already have an account?
							</Link>
						</Box>
					</Box>
				</form>
			</Grid>
		</Grid>
	)
}

export default CreateAccountScreen
