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
		display                        : 'flex',
		justifyContent                 : 'flex-end',
		flexWrap                       : 'wrap',
		padding                        : theme.spacing(0, 2, 0, 2),
		background                     : 'linear-gradient(90deg, rgba(110,53,233,1) 0%, rgba(59,16,152,1) 100%)',
		color                          : theme.palette.common.white,
		[theme.breakpoints.down('sm')]: {
			alignItems     : 'center',
			justifyContent : 'center',
			textAlign      : 'center'
		}
	},
	mainGrid             : {
		marginTop    : theme.spacing(2),
		marginBottom : theme.spacing(2)
	},
	thumbnail            : {
		height : '100%'
	},
	statsBoxesContainer  : {
		[theme.breakpoints.down('sm')]: {
			marginTop : theme.spacing(1)
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
					{/* Title container */}
					<Box className={cls.titleContainer} boxShadow={2} borderRadius={4}>
						<TitleBox data={data.games[0]} />
					</Box>
					<Grid container direction="row" className={cls.mainGrid}>
						{/* Thumbnail */}
						<Grid item container justify="center" alignItems="center" xl={3} lg={3} md={3} sm={12} xs={12}>
							<img className={cls.thumbnail} src={data.games[0].thumbnail} alt={data.games[0].title} />
						</Grid>

						{/* Right side */}
						<Grid
							item
							container
							direction="column"
							justify="center"
							alignItems="center"
							xl={7}
							lg={7}
							md={7}
							sm={12}
							xs={12}
						>
							{/* Stats boxes */}
							<Grid item container className={cls.statsBoxesContainer} justify="center" spacing={2}>
								<StatsBoxes data={data.games[0]} />
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

						{/* Buttons */}
						<Grid item container xl={2} lg={2} md={2} sm={12} xs={12}>
							<Box display="flex" flexDirection="column" width="100%" height="100%">
								<Box className={cls.buttonsContainer}>
									<Button className={cls.button} variant="contained" color="secondary">
										Save
									</Button>
									<Button className={cls.button} variant="contained" color="primary">
										Buy
									</Button>
								</Box>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="center"
									height="40%"
									fontSize={22}
									fontWeight={500}
									color="primary.main"
									mt={1}
								>
									{data.games[0].price} ron
								</Box>
							</Box>
						</Grid>
					</Grid>

					<Divider />

					{/* Shipping */}
					<Grid container direction="row" className={cls.mainGrid}>
						<Box display="flex" width="100%" justifyContent="center">
							<Box className={cls.shippingBox}>
								<Box>
									<LocalShippingTwoToneIcon fontSize="large" color="secondary" />
								</Box>
								<Box>{data.shipCourier ? 'Yes' : 'No'}</Box>
								<Box>{data.shipCourierPayer}</Box>
							</Box>

							<Box className={cls.shippingBox}>
								<Box>
									<MarkunreadMailboxTwoToneIcon fontSize="large" color="secondary" />
								</Box>
								<Box>{data.shipPost ? 'Yes' : 'No'}</Box>
								<Box>{data.shipPostPayer}</Box>
							</Box>

							<Box className={cls.shippingBox}>
								<Box>
									<PersonPinCircleTwoToneIcon fontSize="large" color="secondary" />
								</Box>
								<Box>{data.shipPersonal ? 'Yes' : 'No'}</Box>
								<Box>{data.shipCities.join(', ')}</Box>
							</Box>
						</Box>
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
