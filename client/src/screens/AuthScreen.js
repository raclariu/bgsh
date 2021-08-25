// @ Libraries
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// @ Components
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

// @ Styles
const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	}
}))

// @ Main
const AuthScreen = () => {
	const classes = useStyles()
	const history = useHistory()

	const { location: { pathname } } = history

	const [ selectedTab, setSelectedTab ] = useState(pathname.replace('/', ''))

	const handleChange = (e, val) => {
		setSelectedTab(val)
	}

	return (
		<Grid container className={classes.gridContainer} direction="column" justify="center" alignItems="center">
			<Grid item md={4} sm={7} xs={11}>
				<Tabs
					className={classes.container}
					value={selectedTab}
					centered
					indicatorColor="primary"
					textColor="primary"
					onChange={handleChange}
				>
					<Tab value="signin" onClick={() => history.replace('/signin')} label="Sign In" />
					<Tab value="signup" onClick={() => history.replace('/signup')} label="Sign Up" />
				</Tabs>

				{selectedTab === 'signin' && <SignIn />}
				{selectedTab === 'signup' && <SignUp />}
			</Grid>
		</Grid>
	)
}

export default AuthScreen
