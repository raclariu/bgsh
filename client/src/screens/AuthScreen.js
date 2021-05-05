import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const AuthScreen = ({ value }) => {
	const history = useHistory()

	const [ selectedTab, setSelectedTab ] = useState(value)
	const handleChange = (event, value) => {
		setSelectedTab(value)
	}

	return (
		<Container maxWidth="xs">
			<Tabs value={selectedTab} centered indicatorColor="primary" textColor="primary" onChange={handleChange}>
				<Tab value="signin" onClick={() => history.push('/signin')} label="Sign In" />
				<Tab value="signup" onClick={() => history.push('/signup')} label="Sign Up" />
			</Tabs>

			{selectedTab === 'signin' && <SignIn />}
			{selectedTab === 'signup' && <SignUp />}
		</Container>
	)
}

export default AuthScreen
