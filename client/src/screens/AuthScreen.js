// @ Libraries
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'

// @ Icons
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'

// @ Components
import CustomIconBtn from '../components/CustomIconBtn'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

// @ Main
const AuthScreen = () => {
	const history = useHistory()

	const { location: { pathname } } = history

	return (
		<Box display="flex" justifyContent="center" alignItems="center" height="100%">
			<Box
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
					<CustomIconBtn color="primary" onClick={() => history.push('/')} size="large" edge="start">
						<HomeTwoToneIcon />
					</CustomIconBtn>
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
