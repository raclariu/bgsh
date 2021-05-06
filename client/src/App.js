import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Header from './components/Header'
import HomePageScreen from './screens/HomePageScreen'
import AuthScreen from './screens/AuthScreen'
import MyCollectionScreen from './screens/MyCollectionScreen'

const App = () => {
	return (
		<BrowserRouter>
			<Header />

			<Container>
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
			</Container>
		</BrowserRouter>
	)
}

export default App
