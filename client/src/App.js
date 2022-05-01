// @ Modules
import React, { lazy, useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

// @ CSS
import './css/App.css'

// @ Mui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'

// @ Icons
import ClearIcon from '@mui/icons-material/Clear'

// @ Components
import CustomIconBtn from './components/CustomIconBtn'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header/Header'
import Footer from './components/Footer'

// @ Hooks
import { SnackbarProvider } from 'notistack'

// @ Others
import { getMe } from './actions/userActions'

// @ Theme
import { light, dark } from './constants/themes'

// @ Screens
const Home = lazy(() => import('./screens/HomeScreen'))
const Dashboard = lazy(() => import('./screens/DashboardScreen'))
const LogIn = lazy(() => import('./screens/LogInScreen'))
const ResetPassword = lazy(() => import('./screens/ResetPasswordScreen'))
const CreateAccount = lazy(() => import('./screens/CreateAccountScreen'))
const Settings = lazy(() => import('./screens/SettingsScreen'))
const Collection = lazy(() => import('./screens/CollectionScreen'))
const SellGames = lazy(() => import('./screens/SellGamesScreen'))
const TradeGames = lazy(() => import('./screens/TradeGamesScreen'))
const AddWantedGames = lazy(() => import('./screens/AddWantedGamesScreen'))
const BuyGames = lazy(() => import('./screens/BuyGamesScreen'))
const GamesIndex = lazy(() => import('./screens/GamesIndexScreen'))
const SingleGame = lazy(() => import('./screens/SingleGameScreen'))
const SavedGames = lazy(() => import('./screens/SavedGamesScreen'))
const Messages = lazy(() => import('./screens/MessagesScreen'))
const MyListedGames = lazy(() => import('./screens/MyListedGamesScreen'))
const GamesHistory = lazy(() => import('./screens/GamesHistoryScreen'))
const HotGames = lazy(() => import('./screens/HotGamesScreen'))
const Crowdfunding = lazy(() => import('./screens/CrowdfundingScreen'))
const UserProfile = lazy(() => import('./screens/UserProfileScreen'))
const Changelog = lazy(() => import('./screens/ChangelogScreen'))
const NotFound = lazy(() => import('./screens/NotFoundScreen'))

// @ Main
const App = () => {
	const dispatch = useDispatch()
	const theme = useSelector((state) => state.userPreferences.theme)
	const token = useSelector((state) => state.userToken)
	const { success, loading } = useSelector((state) => state.userData)

	useEffect(
		() => {
			if (token) {
				if (!success) {
					dispatch(getMe())
				}
			}
		},
		[ token, success, dispatch ]
	)

	const location = useLocation()
	const notistackRef = React.createRef()
	const onClickDismiss = (key) => () => {
		notistackRef.current.closeSnackbar(key)
	}

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme === 'light' ? light : dark}>
				<SnackbarProvider
					maxSnack={3}
					dense={isMobile ? true : false}
					ref={notistackRef}
					action={(key) => (
						<CustomIconBtn sx={{ color: '#fff' }} size="small" onClick={onClickDismiss(key)}>
							<ClearIcon sx={{ color: '#fff' }} fontSize="small" />
						</CustomIconBtn>
					)}
				>
					<CssBaseline />

					{loading && <LinearProgress />}

					{(success || !token) && (
						<Suspense fallback={<LinearProgress />}>
							{location.pathname !== '/login' && location.pathname !== '/create-account' && <Header />}

							<Container
								maxWidth="md"
								component="main"
								sx={{
									display       : 'flex',
									flexDirection : 'column',
									pt            : 4,
									pb            : 8,
									minHeight     :
										location.pathname !== '/login' && location.pathname !== '/create-account'
											? 'calc(100% - 155px)'
											: '100%'
								}}
							>
								<Routes>
									<Route index path="/" element={<Home />} />

									<Route path="login" element={<LogIn isActivationPage={false} />} />

									<Route path="activate/:tokenUid" element={<LogIn isActivationPage={true} />} />

									<Route path="reset-password/:tokenUid" element={<ResetPassword />} />

									<Route path="create-account" element={<CreateAccount />} />

									<Route path="changelog" element={<Changelog />} />

									<Route
										path="dashboard"
										element={
											<ProtectedRoute>
												<Dashboard />
											</ProtectedRoute>
										}
									/>

									<Route
										path="sales"
										element={
											<ProtectedRoute>
												<GamesIndex mode="sell" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="trades"
										element={
											<ProtectedRoute>
												<GamesIndex mode="trade" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="wanted"
										element={
											<ProtectedRoute>
												<GamesIndex mode="want" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="sales/:altId"
										element={
											<ProtectedRoute>
												<SingleGame />
											</ProtectedRoute>
										}
									/>

									<Route
										path="trades/:altId"
										element={
											<ProtectedRoute>
												<SingleGame />
											</ProtectedRoute>
										}
									/>

									<Route
										path="wanted/:altId"
										element={
											<ProtectedRoute>
												<SingleGame />
											</ProtectedRoute>
										}
									/>

									<Route
										path="collection/owned"
										element={
											<ProtectedRoute>
												<Collection type="owned" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="collection/for-trade"
										element={
											<ProtectedRoute>
												<Collection type="forTrade" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="collection/want-in-trade"
										element={
											<ProtectedRoute>
												<Collection type="wantInTrade" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="collection/want-to-buy"
										element={
											<ProtectedRoute>
												<Collection type="wantToBuy" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="collection/want-to-play"
										element={
											<ProtectedRoute>
												<Collection type="wantToPlay" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="collection/wishlist"
										element={
											<ProtectedRoute>
												<Collection type="wishlist" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="sell"
										element={
											<ProtectedRoute>
												<SellGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="trade"
										element={
											<ProtectedRoute>
												<TradeGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="want"
										element={
											<ProtectedRoute>
												<AddWantedGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="buy"
										element={
											<ProtectedRoute>
												<BuyGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="saved"
										element={
											<ProtectedRoute>
												<SavedGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="received"
										element={
											<ProtectedRoute>
												<Messages type="received" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="sent"
										element={
											<ProtectedRoute>
												<Messages type="sent" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="settings"
										element={
											<ProtectedRoute>
												<Settings />
											</ProtectedRoute>
										}
									/>

									<Route
										path="user/settings"
										element={
											<ProtectedRoute>
												<Settings />
											</ProtectedRoute>
										}
									/>

									<Route
										path="user/listed"
										element={
											<ProtectedRoute>
												<MyListedGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="user/history/sold"
										element={
											<ProtectedRoute>
												<GamesHistory mode="sell" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="user/history/traded"
										element={
											<ProtectedRoute>
												<GamesHistory mode="trade" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="user/history/bought"
										element={
											<ProtectedRoute>
												<GamesHistory mode="buy" />
											</ProtectedRoute>
										}
									/>

									<Route
										path="profile/:username"
										element={
											<ProtectedRoute>
												<UserProfile />
											</ProtectedRoute>
										}
									/>

									<Route
										path="hot"
										element={
											<ProtectedRoute>
												<HotGames />
											</ProtectedRoute>
										}
									/>

									<Route
										path="crowdfunding"
										element={
											<ProtectedRoute>
												<Crowdfunding />
											</ProtectedRoute>
										}
									/>

									<Route
										path="logout"
										element={
											<ProtectedRoute>
												<Navigate to="/" />
											</ProtectedRoute>
										}
									/>

									<Route path="*" element={<NotFound />} />
								</Routes>
							</Container>

							{location.pathname !== '/login' && location.pathname !== '/create-account' && <Footer />}
						</Suspense>
					)}
				</SnackbarProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default App
