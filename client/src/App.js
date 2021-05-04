import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { Container } from '@material-ui/core'
import Header from './components/Header'
import HomePageScreen from './screens/HomePageScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import MyCollectionScreen from './screens/MyCollectionScreen'

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<Container>
				<main style={{ paddingTop: '25px', paddingBottom: '25px' }}>
					<Route path="/" component={HomePageScreen} exact />
					<Route path="/signin" component={SignInScreen} exact />
					<Route path="/signup" component={SignUpScreen} exact />
					<Route path="/collection" component={MyCollectionScreen} exact />
					<Route path="/signout" exact>
						<Redirect to="/" />
					</Route>
				</main>
			</Container>
		</BrowserRouter>
	)
}

export default App
