// @ Libraries
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'

// @ Icons
import LockOpenIcon from '@material-ui/icons/LockOpen'

// @ Components
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

// @ Styles
const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	tabTitle      : {
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
		<Grid container className={cls.gridContainer} direction="column" justifyContent="center" alignItems="center">
			<Grid item md={4} sm={7} xs={11}>
				<Tabs
					className={cls.container}
					value={selectedTab}
					centered
					indicatorColor="primary"
					textColor="primary"
					onChange={handleChange}
				>
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
