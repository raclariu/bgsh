// @ Libraries
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

// @ Icons
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'

// @ Components
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

// @ Main
const AuthScreen = () => {
	const history = useHistory()

	const { location: { pathname } } = history

	return (
		<Box
			sx={{
				position  : 'absolute',
				left      : '50%',
				top       : '50%',
				transform : 'translate(-50%,-50%)',
				width     : '95%'
			}}
			display="flex"
			justifyContent="center"
			alignItems="center"
		>
			<Box
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				sx={{
					width : {
						xs : '100%',
						sm : '75%',
						md : '50%',
						xl : '30%'
					}
				}}
				p={2}
				bgcolor="background.paper"
				boxShadow={2}
				borderRadius="4px"
			>
				<Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={3}>
					<IconButton color="primary" onClick={() => history.push('/')} size="large" edge="start">
						<HomeTwoToneIcon />
					</IconButton>
					<Box color="primary.main" fontWeight="fontWeightMedium" fontSize={22}>
						{pathname === '/signin' ? 'Sign In' : 'Sign Up'}
					</Box>
				</Box>

				<Box display="flex" alignItems="center" justifyContent="center">
					{pathname === '/signin' && <SignIn />}
					{pathname === '/signup' && <SignUp />}
				</Box>
			</Box>
		</Box>
	)
}

export default AuthScreen
