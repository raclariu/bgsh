import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Chips from '../components/SingleGameScreen/Chips'

import LocalShippingTwoToneIcon from '@material-ui/icons/LocalShippingTwoTone'
import MarkunreadMailboxTwoToneIcon from '@material-ui/icons/MarkunreadMailboxTwoTone'
import PersonPinCircleTwoToneIcon from '@material-ui/icons/PersonPinCircleTwoTone'

import TitleBox from '../components/SingleGameScreen/TitleBox'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import DesLangText from '../components/SingleGameScreen/DesLangText'
import InfoBoxes from '../components/SingleGameScreen/InfoBoxes'

import { getSingleGame } from '../actions/gameActions'

import { FOR_SALE_SINGLE_GAME_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	root                 : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
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
		}
	},
	buttonsContainer     : {
		height                         : '60%',
		display                        : 'flex',
		flexDirection                  : 'column',
		alignItems                     : 'center',
		justifyContent                 : 'flex-end',
		[theme.breakpoints.down('sm')]: {
			flexDirection  : 'row',
			justifyContent : 'center',
			marginTop      : theme.spacing(2)
		}
	},
	button               : {
		width                          : '75%',
		[theme.breakpoints.down('sm')]: {
			width : '20%'
		},
		[theme.breakpoints.down('xs')]: {
			width : '30%'
		}
	},
	shippingBox          : {
		display        : 'flex',
		flexDirection  : 'column',
		width          : '25%',
		justifyContent : 'center',
		alignItems     : 'center'
	}
}))

const SingleGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const match = useRouteMatch()
	const { params: { altId } } = match

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
							<Grid item container justify="center">
								<TitleBox
									title={data.games[0].title}
									year={data.games[0].year}
									type={data.games[0].type}
								/>
							</Grid>

							{/* Stats boxes */}
							<Grid item container justify="center" spacing={2}>
								<StatsBoxes complexity={data.games[0].complexity} stats={data.games[0].stats} />
							</Grid>

							{/* Desginers and language dependence */}
							<Grid item container className={cls.desLangTextContainer}>
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
