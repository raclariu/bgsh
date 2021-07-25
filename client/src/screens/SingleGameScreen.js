import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { formatDistance, parseISO } from 'date-fns'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import MarkunreadMailboxTwoToneIcon from '@material-ui/icons/MarkunreadMailboxTwoTone'
import LocalShippingTwoToneIcon from '@material-ui/icons/LocalShippingTwoTone'
import LocalLibraryTwoToneIcon from '@material-ui/icons/LocalLibraryTwoTone'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import MailTwoToneIcon from '@material-ui/icons/MailTwoTone'

import Chips from '../components/SingleGameScreen/Chips'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import DesLangText from '../components/SingleGameScreen/DesLangText'
import InfoBoxes from '../components/SingleGameScreen/InfoBoxes'
import SaveGameButton from '../components/SaveGameButton'

import { getSingleGame, getSingleSavedGame } from '../actions/gameActions'

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
		margin         : theme.spacing(1, 0, 1, 0),
		'& > *'        : {
			margin : theme.spacing(0.5)
		}
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
		[theme.breakpoints.down('sm')]: {
			height       : '250px',
			marginBottom : theme.spacing(1)
		}
	},
	thumbnail            : {
		objectFit                      : 'contain',
		height                         : '90%',
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
	const { loading: loadingGame, success: successGame, error: errorGame, saleData } = gameForSale

	console.log(data)

	useEffect(
		() => {
			if (!data) {
				dispatch(getSingleGame(altId))
			}

			dispatch(getSingleSavedGame(altId))

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
							<Box
								bgcolor="background.paper"
								className={cls.thumbnailContainer}
								borderRadius={4}
								boxShadow={2}
							>
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
								<Box fontSize={25} textAlign="center">
									{data.games[0].title}
								</Box>
							</Grid>

							{/* Subtitle */}
							<Grid item>
								<Typography component="span">
									<Box
										fontSize={12}
										mb={1}
										fontStyle="italic"
										color="grey.600"
										textAlign="center"
									>{`${data.games[0].type} • ${data.games[0].year}`}</Box>
								</Typography>
							</Grid>

							{/* Stats boxes */}
							<Grid item container justify="center" spacing={2}>
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

					<Divider light />

					{/* Chips */}
					<Box className={cls.chipsBox}>
						<Chips categories={data.games[0].categories} mechanics={data.games[0].mechanics} />
					</Box>

					<Divider light />

					<Grid item container justify="center" alignItems="center">
						<Box>{data.totalPrice} RON</Box>
						<IconButton color="primary">
							<MailTwoToneIcon fontSize="small" />
						</IconButton>
						<SaveGameButton altId={altId} sellerId={data.seller._id} />
					</Grid>

					{/* Shipping */}
					<Grid container>
						<Grid item container xs={12} direction="column">
							<Box p={1} my={2}>
								<Typography component="div">
									{data.shipPost ? (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<MarkunreadMailboxTwoToneIcon color="primary" />
											<Box
												fontSize={16}
												textAlign="center"
												mt={1}
											>{`Shipping by post is available, paid by ${data.shipPostPayer}`}</Box>
										</Box>
									) : (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<CancelRoundedIcon fontSize="small" color="error" />
											<Box fontSize={16} textAlign="center" mt={1}>
												Shipping by post is not available
											</Box>
										</Box>
									)}

									{data.shipCourier ? (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<LocalShippingTwoToneIcon color="primary" />
											<Box
												fontSize={16}
												textAlign="center"
												mt={1}
											>{`Shipping by courier is available, paid by ${data.shipCourierPayer}`}</Box>
										</Box>
									) : (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<CancelRoundedIcon color="error" />
											<Box fontSize={16} textAlign="center" mt={1}>
												Shipping by courier is not available
											</Box>
										</Box>
									)}

									{data.shipPersonal ? (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<LocalLibraryTwoToneIcon color="primary" />
											<Box fontSize={16} textAlign="center" mt={1}>
												Personal shipping is available in
											</Box>
											<Box className={cls.chipsBox}>
												{data.shipCities.map((city, index) => (
													<Chip
														key={index}
														icon={<RoomTwoToneIcon />}
														size="small"
														color="primary"
														variant="outlined"
														label={city}
													/>
												))}
											</Box>
										</Box>
									) : (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<CancelRoundedIcon color="error" />
											<Box fontSize={16} textAlign="center" mt={1}>
												No personal shipping
											</Box>
										</Box>
									)}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Fragment>
			)}
		</div>
	)
}

export default SingleGameScreen
