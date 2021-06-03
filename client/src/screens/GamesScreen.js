import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import { getGamesForSale } from '../actions/gameActions'

const GamesScreen = () => {
	const dispatch = useDispatch()

	const gamesForSale = useSelector((state) => state.gamesForSale)
	const { loading, error, success, games } = gamesForSale

	useEffect(
		() => {
			dispatch(getGamesForSale())
		},
		[ dispatch ]
	)

	return (
		<div>
			{success &&
				games.map((game) => (
					<div key={game._id}>
						{game.sellType === 'individual' ? (
							<div>
								<p>
									{game.data[0].title} {game.data.year}
								</p>
								<p>Type:{game.data[0].type}</p>
								<p>Price:{game.data[0].price} RON</p>
								<p>
									Version:{game.data[0].version.title} {game.data[0].version.year}
								</p>
								<p>Condition:{game.data[0].condition}</p>
								<img src={game.data[0].thumbnail} alt={game._id} />
							</div>
						) : (
							<Paper elevation={5}>
								{game.data.map((obj) => (
									<Fragment>
										<p>Pack</p>
										<p>
											{obj.title} {obj.year}
										</p>
										<p>Type:{obj.type}</p>
										<p>Price:{obj.price} RON</p>
										<p>
											Version:{obj.version.title} {obj.version.year}
										</p>
										<p>Condition:{obj.condition}</p>
										<img src={obj.thumbnail} alt={game._id} />
									</Fragment>
								))}
							</Paper>
						)}
					</div>
				))}
		</div>
	)
}

export default GamesScreen
