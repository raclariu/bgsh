import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { getGamesForSale } from '../actions/gameActions'
import SingleSellGameCard from '../components/SingleSellGameCard'

const useStyles = makeStyles((theme) => ({
	root : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	}
}))

const GamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const gamesForSale = useSelector((state) => state.gamesForSale)
	const { loading, error, success, saleData } = gamesForSale

	useEffect(
		() => {
			dispatch(getGamesForSale())
		},
		[ dispatch ]
	)

	return (
		<Grid container spacing={3} className={cls.root}>
			{success &&
				saleData.map((data) => (
					<Fragment>
						{data.sellType === 'individual' ? (
							<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
								<SingleSellGameCard data={data} />
							</Grid>
						) : (
							<Paper elevation={5}>
								{data.games.map((obj) => (
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
										<img src={obj.thumbnail} alt={obj.title} />
									</Fragment>
								))}
							</Paper>
						)}
					</Fragment>
				))}
		</Grid>
	)
}

export default GamesScreen
