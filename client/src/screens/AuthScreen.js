import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const useStyles = makeStyles((theme) => ({
	gridContainer : {
		margin : theme.spacing(4, 0, 4, 0)
	}
}))

const AuthScreen = ({ value }) => {
	const classes = useStyles()

	const [ selectedTab, setSelectedTab ] = useState(value)

	const history = useHistory()

	const handleChange = (e, value) => {
		setSelectedTab(value)
	}

	return (
		<Grid container className={classes.gridContainer} direction="column" justify="center" alignItems="center">
			<Grid item xl={4} lg={4} md={4} sm={7} xs={11}>
				<Tabs
					className={classes.container}
					value={selectedTab}
					centered
					indicatorColor="secondary"
					textColor="secondary"
					onChange={handleChange}
				>
					<Tab value="signin" onClick={() => history.push('/signin')} label="Sign In" />
					<Tab value="signup" onClick={() => history.push('/signup')} label="Sign Up" />
				</Tabs>

				{selectedTab === 'signin' && <SignIn />}
				{selectedTab === 'signup' && <SignUp />}
			</Grid>
		</Grid>
	)
}

export default AuthScreen
