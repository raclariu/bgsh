// @ Libraries
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'

// @ Mui
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// @ Icons
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// @ Components
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import Theme from '../components/Theme'

const PREFIX = 'AuthScreen'

const classes = {
	tabTitle : `${PREFIX}-tabTitle`
}

const StyledGrid = styled(Grid)(({ theme }) => ({
	[`& .${classes.tabTitle}`]: {
		textTransform : 'none'
	}
}))

// @ Main
const AuthScreen = () => {
	const history = useHistory()

	const { location: { pathname } } = history

	const [ selectedTab, setSelectedTab ] = useState(pathname.replace('/', ''))

	const handleChange = (e, val) => {
		setSelectedTab(val)
	}

	return (
		<StyledGrid
			style={{ height: '100vh' }}
			container
			direction="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box display="flex" alignItems="center" justifyContent="center">
				<IconButton color="primary" onClick={() => history.push('/')} size="large">
					<ArrowBackIcon />
				</IconButton>

				<Theme />
			</Box>

			<Grid item md={4} sm={7} xs={12}>
				<Tabs value={selectedTab} centered indicatorColor="primary" textColor="primary" onChange={handleChange}>
					<Tab
						value="signin"
						onClick={() => history.replace('/signin')}
						label={
							<Box display="flex" alignItems="center">
								<LockOpenIcon />
								<Box className={classes.tabTitle} ml={1}>
									Sign In
								</Box>
							</Box>
						}
					/>
					<Tab
						value="signup"
						onClick={() => history.replace('/signup')}
						label={
							<Box display="flex" alignItems="center">
								<LockOpenIcon />
								<Box className={classes.tabTitle} ml={1}>
									Sign Up
								</Box>
							</Box>
						}
					/>
				</Tabs>

				{selectedTab === 'signin' && <SignIn />}
				{selectedTab === 'signup' && <SignUp />}
			</Grid>
		</StyledGrid>
	)
}

export default AuthScreen
