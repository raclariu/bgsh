// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { formatDistance, parseISO } from 'date-fns'
import LazyLoad from 'react-lazyload'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Fab from '@material-ui/core/Fab'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

// @ Icons
import MarkunreadMailboxTwoToneIcon from '@material-ui/icons/MarkunreadMailboxTwoTone'
import LocalShippingTwoToneIcon from '@material-ui/icons/LocalShippingTwoTone'
import LocalLibraryTwoToneIcon from '@material-ui/icons/LocalLibraryTwoTone'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone'
import AccessTimeTwoToneIcon from '@material-ui/icons/AccessTimeTwoTone'
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone'
import ChildCareTwoToneIcon from '@material-ui/icons/ChildCareTwoTone'
import FaceTwoToneIcon from '@material-ui/icons/FaceTwoTone'
import PublicTwoToneIcon from '@material-ui/icons/PublicTwoTone'
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CachedIcon from '@material-ui/icons/Cached'

// @ Components
import Chips from '../components/SingleGameScreen/Chips'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import InfoBox from '../components/SingleGameScreen/InfoBox'
import SaveGameButton from '../components/SaveGameButton'
import Loader from '../components/Loader'
import SendMessage from '../components/SendMessage'
import HelmetComponent from '../components/HelmetComponent'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { getSingleGame, getSingleSavedGame, bggGetGallery } from '../actions/gameActions'
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
		margin         : theme.spacing(2, 0, 2, 0),
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
	},
	priceContainer     : {
		marginTop : theme.spacing(2)
	},
	galleryImg         : {
		maxHeight : '100%',
		width     : '100%',
		objectFit : 'contain',
		cursor    : 'zoom-in'
	},
	dialogImg          : {
		maxHeight : '100%',
		width     : '100%',
		objectFit : 'contain'
	},
	fab                : {
		position  : 'fixed',
		left      : '50%',
		bottom    : theme.spacing(2),
		transform : 'translate(-50%, 0)'
	}
}))

// @ Main
const SingleGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const params = useParams()
	const { altId } = params
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const [ index, setIndex ] = useState(0)

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const [ open, setOpen ] = useState(false)
	const [ imgIndex, setImgIndex ] = useState(0)
	const [ load, setLoad ] = useState(false)

	const gameForSale = useSelector((state) => state.gameForSale)
	const { loading, success, error, saleData: data } = gameForSale

	console.log(data)

	const bggGallery = useSelector((state) => state.bggGallery)
	const { loading: loadingGallery, success: successGallery, error: errorGallery, gallery } = bggGallery

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

	useEffect(
		() => {
			if (success) {
				const mappedBggIds = data.games.map((game) => game.bggId)

				dispatch(bggGetGallery(mappedBggIds))
			}
		},
		[ dispatch, success, data ]
	)

	const handleOpenImage = (imgIndexClicked) => {
		setImgIndex(imgIndexClicked)
		setOpen(true)
	}

	const handleCloseImage = () => {
		setOpen(false)
		setLoad(false)
	}

	const onImgLoad = () => {
		setLoad(true)
	}

	const cycleGames = (type) => {
		if (type === 'back') {
			if (index > 0) {
				setIndex(index - 1)
			}
		}
		if (type === 'forward') {
			if (data.games.length > index + 1) {
				setIndex(index + 1)
			}
		}
	}

	return (
		<div className={cls.root}>
			{success && (
				<Fragment>
					<HelmetComponent title={success ? data.games[index].title : 'Boardgame'} />

					{data.type === 'pack' && (
						<Box display="flex" className={cls.fab}>
							<Fab
								size="small"
								color="secondary"
								disabled={index === 0}
								onClick={() => cycleGames('back')}
							>
								<ArrowBackIcon />
							</Fab>
							<Box ml={1}>
								<Fab
									size="small"
									color="secondary"
									disabled={data.games.length === index + 1}
									onClick={() => cycleGames('forward')}
								>
									<ArrowForwardIcon />
								</Fab>
							</Box>
						</Box>
					)}

					<Grid
						container
						justifyContent="center"
						alignItems="flex-start"
						direction="row"
						className={cls.mainGrid}
					>
						{/* Thumbnail */}
						<Grid item container md={4} xs={12} justifyContent="center">
							<Box
								bgcolor="background.paper"
								className={cls.thumbnailContainer}
								borderRadius={4}
								boxShadow={2}
							>
								<Zoom
									overlayBgColorStart="rgba(255, 255, 255, 0)"
									overlayBgColorEnd="rgba(255, 255, 255, 0)"
									zoomMargin={40}
								>
									<img
										className={cls.thumbnail}
										src={displayImageHandler(data.games[index].image, data.games[index].thumbnail)}
										alt={data.games[index].title}
									/>
								</Zoom>
							</Box>
						</Grid>

						{/* Right side */}

						<Grid
							item
							container
							direction="column"
							justifyContent="center"
							alignItems="center"
							md={8}
							xs={12}
						>
							{/* Title */}
							<Grid item>
								<Box fontSize={22} textAlign="center">
									{data.games[index].title}
								</Box>
							</Grid>

							{/* Subtitle */}
							<Grid item>
								<Box fontSize={12} fontStyle="italic" color="grey.600" textAlign="center">
									{`${data.games[index].type} • ${data.games[index].year}`}
								</Box>
							</Grid>

							{/* Stats boxes */}
							<Grid
								item
								container
								className={cls.statsBoxes}
								justifyContent="center"
								alignItems="center"
								spacing={1}
							>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[index].complexity}
										stats={data.games[index].stats}
										type="rating"
									/>
								</Grid>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[index].complexity}
										stats={data.games[index].stats}
										type="rank"
									/>
								</Grid>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[index].complexity}
										stats={data.games[index].stats}
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
												{data.games[index].designers.length > 0 ? (
													data.games[index].designers.join(', ')
												) : (
													'N/A'
												)}
											</Box>
										</Box>

										<Box display="flex">
											<PublicTwoToneIcon fontSize="small" color="primary" />
											<Box ml={0.5}>{data.games[index].languageDependence}</Box>
										</Box>
									</Typography>
								</Box>
							</Grid>

							{/* Game info */}
							<Grid
								item
								container
								className={cls.infoBoxesContainer}
								justifyContent="center"
								alignItems="center"
								spacing={1}
							>
								<Grid item xs={6} sm={3}>
									<InfoBox
										data={`${data.games[index].minPlayers} - ${data.games[index]
											.maxPlayers} players`}
									>
										<PeopleAltTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
								<Grid item xs={6} sm={3}>
									<InfoBox
										data={
											data.games[index].suggestedPlayers ? (
												`${data.games[index].suggestedPlayers} players`
											) : (
												'N/A'
											)
										}
									>
										<PersonAddTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
								<Grid item xs={6} sm={3}>
									<InfoBox
										data={data.games[index].playTime ? `${data.games[index].playTime} min.` : 'N/A'}
									>
										<AccessTimeTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
								<Grid item xs={6} sm={3}>
									<InfoBox data={data.games[index].minAge ? `${data.games[index].minAge}` : 'N/A'}>
										<ChildCareTwoToneIcon fontSize="small" color="primary" />
									</InfoBox>
								</Grid>
							</Grid>

							<Grid
								className={cls.priceContainer}
								item
								container
								justifyContent="center"
								alignItems="center"
							>
								{data.mode === 'sell' && (
									<Box fontWeight="fontWeightMedium">
										<Box>{data.totalPrice} RON</Box>
									</Box>
								)}

								<SendMessage recipientUsername={data.seller.username} recipientId={data.seller._id} />
								<SaveGameButton altId={altId} sellerId={data.seller._id} />
							</Grid>
						</Grid>
					</Grid>

					<Divider light />

					{/* Shipping */}
					<Box display="flex" alignItems="center">
						<LocalShippingTwoToneIcon color="primary" fontSize="small" />
						<Box ml={1} className={cls.mainGrid} fontSize={16}>
							Shipping
						</Box>
					</Box>
					<Grid className={cls.mainGrid} container>
						<Grid item container xs={12} direction="column">
							<Box p={1}>
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
														key={city}
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

					<Divider light />

					<Box display="flex" alignItems="center">
						{loadingGallery ? <Loader size={20} /> : <ImageTwoToneIcon color="primary" fontSize="small" />}

						<Box ml={1} className={cls.mainGrid} fontSize={16}>
							Gallery
						</Box>
					</Box>

					{errorGallery && <CustomAlert severity="warning">{errorGallery}</CustomAlert>}

					{successGallery && (
						<Fragment>
							<Grid className={cls.mainGrid} container alignItems="center" spacing={2}>
								{gallery[index].map((obj, i) => (
									<Grid item key={obj.imageid} xs={12} sm={6} md={4} lg={3}>
										<LazyLoad offset={200} once>
											<Box
												display="flex"
												justifyContent="center"
												height="220px"
												bgcolor="background.paper"
												borderRadius={4}
												boxShadow={2}
												p={2}
											>
												<img
													onClick={() => handleOpenImage(i)}
													className={cls.galleryImg}
													src={obj.thumbnail}
													alt={obj.caption}
												/>
											</Box>
										</LazyLoad>
									</Grid>
								))}
							</Grid>

							<Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseImage}>
								<DialogTitle disableTypography>
									<Typography variant="subtitle2">{gallery[index][imgIndex].caption}</Typography>
								</DialogTitle>

								<DialogContent dividers>
									<img
										alt={gallery[index][imgIndex].caption}
										src={gallery[index][imgIndex].image}
										hidden={!load}
										onLoad={onImgLoad}
										className={cls.dialogImg}
									/>

									{!load && (
										<Box p={10} display="flex" justifyContent="center" alignItems="center">
											<Loader />
										</Box>
									)}
								</DialogContent>

								<DialogActions>
									<Button
										color="primary"
										variant="outlined"
										href={`https://boardgamegeek.com${gallery[index][imgIndex].extLink}`}
										target="_blank"
										rel="noopener"
									>
										See on BGG
									</Button>
								</DialogActions>
							</Dialog>
						</Fragment>
					)}

					<Divider light />

					{/* Chips */}
					<Box className={cls.chipsBox}>
						<Chips categories={data.games[index].categories} mechanics={data.games[index].mechanics} />
					</Box>
				</Fragment>
			)}
		</div>
	)
}

export default SingleGameScreen
