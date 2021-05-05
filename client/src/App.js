import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { Container } from '@material-ui/core'
import Header from './components/Header'
import HomePageScreen from './screens/HomePageScreen'
import AuthScreen from './screens/AuthScreen'
import MyCollectionScreen from './screens/MyCollectionScreen'

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<Container>
				<main style={{ paddingTop: '25px', paddingBottom: '25px' }}>
					<Route path="/" exact>
						<HomePageScreen />
					</Route>
					<Route path="/signin" exact>
						<AuthScreen value="signin" />
					</Route>
					<Route path="/signup" exact>
						<AuthScreen value="signup" />
					</Route>
					<Route path="/collection" exact>
						<MyCollectionScreen />
					</Route>
					<Route path="/signout" exact>
						<Redirect to="/" />
					</Route>
				</main>
			</Container>
		</BrowserRouter>
	)
}

export default App
