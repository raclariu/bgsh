import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Chips from '../components/SingleGameScreen/Chips'

import TitleBox from '../components/SingleGameScreen/TitleBox'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import DesLangText from '../components/SingleGameScreen/DesLangText'
import InfoBoxes from '../components/SingleGameScreen/InfoBoxes'

import { getSingleGame } from '../actions/gameActions'

import { FOR_SALE_SINGLE_GAME_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	root                 : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	chipsBox             : {
		display        : 'flex',
		justifyContent : 'center',
		flexWrap       : 'wrap',
		padding        : theme.spacing(1),
		margin         : theme.spacing(1, 0, 4, 0),
		'& > *'        : {
			margin : theme.spacing(0.5)
		}
	},
	titleContainer       : {
		display        : 'flex',
		justifyContent : 'center',
		flexWrap       : 'wrap',
		padding        : theme.spacing(0, 2, 0, 2)
	},
	mainGrid             : {
		marginTop    : theme.spacing(2),
		marginBottom : theme.spacing(2)
	},
	thumbnailContainer   : {
		display                        : 'flex',
		justifyContent                 : 'center',
		alignItems                     : 'center',
		height                         : '100%',
		width                          : '100%',
		backgroundColor                : 'rgba(1,1,1,0.1)',
		[theme.breakpoints.down('sm')]: {
			height : '250px'
		}
	},
	thumbnail            : {
		objectFit                      : 'contain',
		height                         : '80%',
		width                          : 'auto',
		overflow                       : 'auto',
		[theme.breakpoints.down('sm')]: {
			height : '220px'
		}
	},
	desLangTextContainer : {
		marginTop    : theme.spacing(1),
		marginBottom : theme.spacing(1)
	},
	infoBoxesContainer   : {
		width                          : '90%',
		[theme.breakpoints.down('sm')]: {
			width : '80%'
		},
		[theme.breakpoints.down('xs')]: {
			width : '75%'
		}
	}
}))

const SingleGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const params = useParams()
	const { altId } = params

	let data = useSelector((state) => {
		return state.gamesIndex.saleData ? state.gamesIndex.saleData.find((game) => game.altId === altId) : null
	})

	const gameForSale = useSelector((state) => state.gameForSale)
	const { loading, success, error, saleData } = gameForSale

	console.log(data)

	useEffect(
		() => {
			if (!data) {
				dispatch(getSingleGame(altId))
			}

			return () => {
				dispatch({ type: FOR_SALE_SINGLE_GAME_RESET })
			}
		},
		[ dispatch, data, altId ]
	)

	return (
		<div className={cls.root}>
			{data && (
				<Fragment>
					<Grid container direction="row" className={cls.mainGrid}>
						{/* Thumbnail */}
						<Grid item container xl={4} lg={4} md={4} sm={12} xs={12} justify="center">
							<Box className={cls.thumbnailContainer} borderRadius={4} boxShadow={2}>
								<img
									className={cls.thumbnail}
									src={data.games[0].thumbnail}
									alt={data.games[0].title}
								/>
							</Box>
						</Grid>

						{/* Right side */}
						<Grid
							item
							container
							direction="column"
							justify="center"
							alignItems="center"
							xl={8}
							lg={8}
							md={8}
							sm={12}
							xs={12}
						>
							{/* Title */}
							<Grid item>
								<TitleBox
									title={data.games[0].title}
									year={data.games[0].year}
									type={data.games[0].type}
								/>
							</Grid>

							{/* Stats boxes */}
							<Grid item container justify="center">
								<StatsBoxes
									variant="full"
									complexity={data.games[0].complexity}
									stats={data.games[0].stats}
								/>
							</Grid>

							{/* Desginers and language dependence */}
							<Grid item className={cls.desLangTextContainer}>
								<DesLangText data={data.games[0]} />
							</Grid>

							{/* Game info */}
							<Grid item container className={cls.infoBoxesContainer} justify="center" spacing={2}>
								<InfoBoxes data={data.games[0]} />
							</Grid>
						</Grid>
					</Grid>

					<Divider />
					{/* Chips */}
					<Box className={cls.chipsBox}>
						<Chips categories={data.games[0].categories} mechanics={data.games[0].mechanics} />
					</Box>
				</Fragment>
			)}
		</div>
	)
}

export default SingleGameScreen
