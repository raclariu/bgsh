import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePageScreen from './screens/HomePageScreen'
import AuthScreen from './screens/AuthScreen'
import ProfileScreen from './screens/ProfileScreen'
import CollectionScreen from './screens/CollectionScreen'
import SellGameScreen from './screens/SellGameScreen'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
	return (
		<BrowserRouter>
			<Header />

			<Container maxWidth="md" component="main">
				<Route path="/" exact>
					<HomePageScreen />
				</Route>

				<Route path={[ '/signin', '/signup' ]} exact>
					<AuthScreen />
				</Route>

				<ProtectedRoute path="/profile" exact>
					<ProfileScreen />
				</ProtectedRoute>

				<Route path="/collection" exact>
					<CollectionScreen />
				</Route>

				<Route path="/sell" exact>
					<SellGameScreen />
				</Route>

				<Route path="/signout" exact>
					<Redirect to="/" />
				</Route>
			</Container>

			<Footer />
		</BrowserRouter>
	)
}

export default App
