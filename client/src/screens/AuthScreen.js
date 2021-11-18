// @ Libraries
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import LockOpenIcon from '@material-ui/icons/LockOpen'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

// @ Components
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import Theme from '../components/Theme'

// @ Styles
const useStyles = makeStyles((theme) => ({
	tabTitle : {
		textTransform : 'none'
	}
}))

// @ Main
const AuthScreen = () => {
	const cls = useStyles()
	const history = useHistory()

	const { location: { pathname } } = history

	const [ selectedTab, setSelectedTab ] = useState(pathname.replace('/', ''))

	const handleChange = (e, val) => {
		setSelectedTab(val)
	}

	return (
		<Grid style={{ height: '100vh' }} container direction="column" justifyContent="center" alignItems="center">
			<Box display="flex" alignItems="center" justifyContent="center">
				<IconButton color="primary" onClick={() => history.push('/')}>
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
								<Box className={cls.tabTitle} ml={1}>
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
								<Box className={cls.tabTitle} ml={1}>
									Sign Up
								</Box>
							</Box>
						}
					/>
				</Tabs>

				{selectedTab === 'signin' && <SignIn />}
				{selectedTab === 'signup' && <SignUp />}
			</Grid>
		</Grid>
	)
}

export default AuthScreen
