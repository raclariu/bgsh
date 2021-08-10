// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { formatDistance, parseISO } from 'date-fns'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// @ Icons
import MarkunreadMailboxTwoToneIcon from '@material-ui/icons/MarkunreadMailboxTwoTone'
import LocalShippingTwoToneIcon from '@material-ui/icons/LocalShippingTwoTone'
import LocalLibraryTwoToneIcon from '@material-ui/icons/LocalLibraryTwoTone'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import MailTwoToneIcon from '@material-ui/icons/MailTwoTone'
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone'
import AccessTimeTwoToneIcon from '@material-ui/icons/AccessTimeTwoTone'
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone'
import ChildCareTwoToneIcon from '@material-ui/icons/ChildCareTwoTone'
import FaceTwoToneIcon from '@material-ui/icons/FaceTwoTone'
import PublicTwoToneIcon from '@material-ui/icons/PublicTwoTone'

// @ Components
import Chips from '../components/SingleGameScreen/Chips'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import InfoBox from '../components/SingleGameScreen/InfoBox'
import SaveGameButton from '../components/SaveGameButton'

// @ Others
import { getSingleGame, getSingleSavedGame } from '../actions/gameActions'
import { FOR_SALE_SINGLE_GAME_RESET } from '../constants/gameConstants'

// @ Styles
const useStyles = makeStyles((theme) => ({
	root               : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	chipsBox           : {
		display        : 'flex',
		justifyContent : 'center',
		flexWrap       : 'wrap',
		margin         : theme.spacing(1, 0, 1, 0),
		'& > *'        : {
			margin : theme.spacing(0.5)
		}
	},
	mainGrid           : {
		marginTop    : theme.spacing(2),
		marginBottom : theme.spacing(2)
	},
	thumbnailContainer : {
		display                        : 'flex',
		justifyContent                 : 'center',
		alignItems                     : 'center',
		height                         : '250px',
		width                          : '100%',
		padding                        : theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			marginBottom : theme.spacing(1)
		}
	},
	thumbnail          : {
		objectFit : 'contain',
		height    : '220px',
		width     : 'auto',
		overflow  : 'auto'
	},
	statsBoxes         : {
		marginTop    : theme.spacing(1),
		marginBottom : theme.spacing(1)
	},
	infoBoxesContainer : {
		width                          : '90%',
		marginTop                      : theme.spacing(1),
		[theme.breakpoints.down('xs')]: {
			width : '70%'
		}
	}
}))

// @ Main
const SingleGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const params = useParams()
	const { altId } = params
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	// let data = useSelector((state) => {
	// 	return state.gamesIndex.gamesData ? state.gamesIndex.gamesData.find((game) => game.altId === altId) : null
	// })

	const gameForSale = useSelector((state) => state.gameForSale)
	const { loading, success, error, saleData: data } = gameForSale

	useEffect(
		() => {
			dispatch(getSingleGame(altId))

			dispatch(getSingleSavedGame(altId))

			return () => {
				dispatch({ type: FOR_SALE_SINGLE_GAME_RESET })
			}
		},
		[ dispatch, altId ]
	)

	return (
		<div className={cls.root}>
			{data && (
				<Fragment>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						direction="row"
						className={cls.mainGrid}
					>
						{/* Thumbnail */}
						<Grid item container md={4} xs={12} justify="center">
							<Box
								bgcolor="background.paper"
								className={cls.thumbnailContainer}
								borderRadius={4}
								boxShadow={2}
							>
								<img
									className={cls.thumbnail}
									src={displayImageHandler(data.games[0].image, data.games[0].thumbnail)}
									alt={data.games[0].title}
								/>
							</Box>
						</Grid>

						{/* Right side */}

						<Grid item container direction="column" justify="center" alignItems="center" md={8} xs={12}>
							{/* Title */}
							<Grid item>
								<Box fontSize={22} textAlign="center">
									{data.games[0].title}
								</Box>
							</Grid>

							{/* Subtitle */}
							<Grid item>
								<Box fontSize={12} fontStyle="italic" color="grey.600" textAlign="center">
									{`${data.games[0].type} • ${data.games[0].year}`}
								</Box>
							</Grid>

							{/* Stats boxes */}
							<Grid
								item
								container
								className={cls.statsBoxes}
								justify="center"
								alignItems="center"
								spacing={1}
							>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[0].complexity}
										stats={data.games[0].stats}
										type="rating"
									/>
								</Grid>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[0].complexity}
										stats={data.games[0].stats}
										type="rank"
									/>
								</Grid>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[0].complexity}
										stats={data.games[0].stats}
										type="complexity"
									/>
								</Grid>
							</Grid>

							{/* Desginers and language dependence */}
							<Grid item>
								<Box
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
									justifyContent="center"
								>
									<Typography variant="caption">
										<Box display="flex">
											<FaceTwoToneIcon fontSize="small" color="primary" />
											<Box ml={0.5}>
												{data.games[0].designers.length > 0 ? (
													data.games[0].designers.join(', ')
												) : (
													'N/A'
												)}
											</Box>
										</Box>

										<Box display="flex">
											<PublicTwoToneIcon fontSize="small" color="primary" />
											<Box ml={0.5}>{data.games[0].languageDependence}</Box>
										</Box>
									</Typography>
								</Box>
							</Grid>

							{/* Game info */}
							<Grid
								item
								container
								className={cls.infoBoxesContainer}
								justify="center"
								alignItems="center"
								spacing={1}
							>
								<Grid item xs={6} sm={3}>
									<InfoBox data={`${data.games[0].minPlayers} - ${data.games[0].maxPlayers} players`}>
										<PeopleAltTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
								<Grid item xs={6} sm={3}>
									<InfoBox
										data={
											data.games[0].suggestedPlayers ? (
												`${data.games[0].suggestedPlayers} players`
											) : (
												'N/A'
											)
										}
									>
										<PersonAddTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
								<Grid item xs={6} sm={3}>
									<InfoBox data={data.games[0].playTime ? `${data.games[0].playTime} min.` : 'N/A'}>
										<AccessTimeTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
								<Grid item xs={6} sm={3}>
									<InfoBox data={data.games[0].minAge ? `${data.games[0].minAge}` : 'N/A'}>
										<ChildCareTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
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
						{data.mode === 'sell' && (
							<Box fontWeight="fontWeightMedium" mt={0.5}>
								<Box>{data.totalPrice} RON</Box>
							</Box>
						)}

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
