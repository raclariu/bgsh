import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePageScreen from './screens/HomePageScreen'
import AuthScreen from './screens/AuthScreen'
import ProfileScreen from './screens/ProfileScreen'
import CollectionScreen from './screens/CollectionScreen'
import SellGamesScreen from './screens/SellGamesScreen'
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

				<ProtectedRoute path="/collection" exact>
					<CollectionScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/sell" exact>
					<SellGamesScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/signout" exact>
					<Redirect to="/" />
				</ProtectedRoute>
			</Container>

			<Footer />
		</BrowserRouter>
	)
}

export default App
