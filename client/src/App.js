import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePageScreen from './screens/HomePageScreen'
import AuthScreen from './screens/AuthScreen'
import ProfileScreen from './screens/ProfileScreen'
import CollectionScreen from './screens/CollectionScreen'
import SellGamesScreen from './screens/SellGamesScreen'
import WishlistScreen from './screens/WishlistScreen'
import ProtectedRoute from './components/ProtectedRoute'
import GamesIndexScreen from './screens/GamesIndexScreen'
import SingleGameScreen from './screens/SingleGameScreen'
import SavedGamesScreen from './screens/SavedGamesScreen'
import MyGamesSaleScreen from './screens/MyGamesSaleScreen'
import HistorySoldGamesScreen from './screens/HistorySoldGamesScreen'

const App = () => {
	return (
		<BrowserRouter>
			<CssBaseline />
			<Header />

			<Container maxWidth="md" component="main">
				<Route path="/" exact>
					<HomePageScreen test={1} />
				</Route>

				<Route path={[ '/signin', '/signup' ]} exact>
					<AuthScreen />
				</Route>

				<ProtectedRoute path="/profile" exact>
					<ProfileScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/games" exact>
					<GamesIndexScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/games/:altId" exact>
					<SingleGameScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/collection" exact>
					<CollectionScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/wishlist" exact>
					<WishlistScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/sell" exact>
					<SellGamesScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/saved" exact>
					<SavedGamesScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/my-games/sale" exact>
					<MyGamesSaleScreen />
				</ProtectedRoute>

				<ProtectedRoute path="/my-games/history/sold" exact>
					<HistorySoldGamesScreen />
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
