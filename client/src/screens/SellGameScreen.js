import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { bggGetGameDetails } from '../actions/gameActions'

// game arr ['169786','312484','167791']

const SellGameScreen = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const bggIds = location.state

	const bggGameDetails = useSelector((state) => state.bggGameDetails)
	const { loading, error, success, games } = bggGameDetails

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	useEffect(
		() => {
			if (userInfo) {
				dispatch(bggGetGameDetails(bggIds.map((game) => game.bggId)))
			} else {
				history.push('/signin')
			}
		},
		[ dispatch, bggIds, userInfo, history ]
	)

	return (
		<Fragment>
			{error && <Message>{error}</Message>}

			{loading && <Loader />}

			<Grid container>
				{success &&
					games.map((game) => (
						<Grid item key={game.id} xl={12} lg={12} md={12} sm={12} xs={12}>
							<Paper elevation={4}>
								{game.title}
								<img src={game.thumbnail} alt={game.bggId} />
							</Paper>
						</Grid>
					))}
			</Grid>
		</Fragment>
	)
}

export default SellGameScreen
