// @ Libraries
import React, { Fragment, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

// @ Components
import CustomIconBtn from '../components/CustomIconBtn'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'

// @ Others
import { useResetPasswordMutation } from '../hooks/hooks'

// @ Main
const ResetPasswordScreen = () => {
	const params = useParams()
	const navigate = useNavigate()

	const [ passwordNew, setPasswordNew ] = useState('')
	const [ passwordNewConfirmation, setPasswordNewConfirmation ] = useState('')
	const [ passNewVisibility, setPassNewVisibility ] = useState(false)
	const [ passNewConfirmationVisibility, setPassNewConfirmationVisibility ] = useState(false)

	const { isLoading, mutate, isError, error } = useResetPasswordMutation({
		resetForm : () => {
			setPasswordNew('')
			setPasswordNewConfirmation('')
			navigate('/login', { replace: true })
		}
	})

	const passwordNewErrorMsg = isError && error.response && error.response.data.message.passwordNewError
	const passwordNewConfirmationErrorMsg =
		isError && error.response && error.response.data.message.passwordNewConfirmationError

	const handlePassVisibility = (type) => {
		if (type === 'passNew') {
			setPassNewVisibility(!passNewVisibility)
		}

		if (type === 'passNewConfirmation') {
			setPassNewConfirmationVisibility(!passNewConfirmationVisibility)
		}
	}

	const submitHandler = (e) => {
		e.preventDefault()
		mutate({ tokenUid: params.tokenUid, passwordNew, passwordNewConfirmation })
	}

	return (
		<Grid container justifyContent="center" alignItems="center" height="100%" sx={{ flex: 1 }}>
			<Grid item xs={12} sm={8} md={6}>
				<form onSubmit={submitHandler} autoComplete="off" style={{ height: '100%' }}>
					<Box color="primary.main" fontWeight="fontWeightMedium" fontSize="h5.fontSize" mb={3}>
						Change your password
					</Box>

					<Input
						sx={{ minHeight: '90px' }}
						error={isError && passwordNewErrorMsg ? true : false}
						helperText={isError ? passwordNewErrorMsg : false}
						onChange={(inputVal) => setPasswordNew(inputVal)}
						value={passwordNew}
						size="medium"
						id="passwordNew"
						name="passwordNew"
						label="New Password"
						type={passNewVisibility ? 'text' : 'password'}
						InputProps={{
							endAdornment : (
								<InputAdornment position="end">
									<CustomIconBtn onClick={() => handlePassVisibility('passNew')}>
										{passNewVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
									</CustomIconBtn>
								</InputAdornment>
							)
						}}
						fullWidth
						required
					/>

					<Input
						sx={{ minHeight: '90px' }}
						error={isError && passwordNewConfirmationErrorMsg ? true : false}
						helperText={isError ? passwordNewConfirmationErrorMsg : false}
						onChange={(inputVal) => setPasswordNewConfirmation(inputVal)}
						value={passwordNewConfirmation}
						size="medium"
						id="passwordNewConfirmation"
						name="passwordNewConfirmation"
						label="Confirm New Password"
						type={passNewConfirmationVisibility ? 'text' : 'password'}
						InputProps={{
							endAdornment : (
								<InputAdornment position="end">
									<CustomIconBtn onClick={() => handlePassVisibility('passNewConfirmation')}>
										{passNewConfirmationVisibility ? (
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
						variant="contained"
						type="submit"
						color="primary"
						size="large"
						fullWidth
						loading={isLoading}
					>
						Change password
					</LoadingBtn>
				</form>
			</Grid>
		</Grid>
	)
}

export default ResetPasswordScreen
