// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import useMediaQuery from '@mui/material/useMediaQuery'
import { formatDistance, parseISO } from 'date-fns'
import LazyLoad from 'react-lazyload'
import Zoom from 'react-medium-image-zoom'
import { useInView } from 'react-intersection-observer'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import 'react-medium-image-zoom/dist/styles.css'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'

// @ Icons
import MarkunreadMailboxTwoToneIcon from '@mui/icons-material/MarkunreadMailboxTwoTone'
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone'
import LocalLibraryTwoToneIcon from '@mui/icons-material/LocalLibraryTwoTone'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import RoomTwoToneIcon from '@mui/icons-material/RoomTwoTone'
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone'
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone'
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone'
import ChildCareTwoToneIcon from '@mui/icons-material/ChildCareTwoTone'
import FaceTwoToneIcon from '@mui/icons-material/FaceTwoTone'
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone'
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'

// @ Components
import Chips from '../components/SingleGameScreen/Chips'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import InfoBox from '../components/SingleGameScreen/InfoBox'
import SaveGameButton from '../components/SaveGameButton'
import Loader from '../components/Loader'
import SendMessage from '../components/SendMessage'
import HelmetComponent from '../components/HelmetComponent'
import CustomAlert from '../components/CustomAlert'
import CustomTooltip from '../components/CustomTooltip'

// @ Others
import { apiFetchSingleGame, apiFetchGallery } from '../api/api'

const StyledChipsBox = styled(Box)(({ theme }) => ({
	display        : 'flex',
	justifyContent : 'center',
	flexWrap       : 'wrap',
	margin         : theme.spacing(2, 0, 2, 0),
	gap            : theme.spacing(1)
}))

const StyledImg = styled('img')({
	objectFit : 'contain',
	height    : '220px',
	width     : 'auto',
	overflow  : 'auto'
})

const StyledMasonryImg = styled('img')({
	verticalAlign : 'middle',
	maxHeight     : '100%',
	width         : '100%',
	objectFit     : 'contain',
	cursor        : 'zoom-in'
})

const StyledDialogImg = styled('img')({
	maxHeight : '100%',
	width     : '100%',
	objectFit : 'contain'
})

// @ Main
const SingleGameScreen = () => {
	const params = useParams()
	const { altId } = params
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'singleGame', altId ],
		() => apiFetchSingleGame(altId),
		{
			staleTime : 1000 * 60 * 3
		}
	)

	const { ref: galleryRef, inView: galleryInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	console.log(galleryInView)

	const {
		isLoading : isLoadingGallery,
		isError   : isErrorGallery,
		error     : errorGallery,
		data      : galleryData,
		isSuccess : isSuccessGallery
	} = useQuery(
		[ 'gallery', altId ],
		() => {
			const bggIds = data.games.map((game) => game.bggId)
			return apiFetchGallery(bggIds)
		},
		{
			enabled              : isSuccess && galleryInView,
			staleTime            : 1000 * 60 * 60,
			refetchOnWindowFocus : false
		}
	)

	const [ index, setIndex ] = useState(0)
	const [ imgIndex, setImgIndex ] = useState(0)
	const [ open, setOpen ] = useState(false)
	const [ imgLoaded, setImgLoaded ] = useState(false)

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const handleOpenImage = (imgIndexClicked) => {
		setImgIndex(imgIndexClicked)
		setOpen(true)
	}

	const handleCloseImage = () => {
		setOpen(false)
		setImgLoaded(false)
	}

	const onImgLoad = () => {
		setImgLoaded(true)
	}

	const cycleGames = (type) => {
		setImgIndex(0)
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

	const cycleImages = (type) => {
		if (type === 'back') {
			if (imgIndex > 0) {
				setImgLoaded(false)
				setImgIndex(imgIndex - 1)
			}
		}
		if (type === 'forward') {
			if (galleryData[index].length > imgIndex + 1) {
				setImgLoaded(false)
				setImgIndex(imgIndex + 1)
			}
		}
	}

	return (
		<Fragment>
			{isLoading && (
				<Box display="flex" justifyContent="center">
					<Loader />
				</Box>
			)}

			{isError && (
				<Box>
					<CustomAlert>{error.response.data.message}</CustomAlert>
				</Box>
			)}

			{isSuccess && (
				<Fragment>
					<HelmetComponent title={isSuccess ? data.games[index].title : 'Boardgame'} />

					{data.isPack && (
						<Box
							sx={{
								display   : 'flex',
								position  : 'fixed',
								left      : '50%',
								bottom    : (theme) => theme.spacing(3),
								transform : 'translate(-50%, 0)'
							}}
						>
							<Fab
								size="small"
								color="secondary"
								disabled={index === 0}
								onClick={() => cycleGames('back')}
							>
								<ArrowBackIcon />
							</Fab>
							<Box ml={2}>
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

					<Grid container justifyContent="center" alignItems="flex-start" direction="row">
						{/* Thumbnail */}
						<Grid item container md={4} xs={12} justifyContent="center">
							<Box
								bgcolor="background.paper"
								borderRadius="4px"
								boxShadow={2}
								sx={{
									display        : 'flex',
									justifyContent : 'center',
									alignItems     : 'center',
									height         : '250px',
									width          : '100%',
									padding        : 1,
									mb             : {
										md : 0,
										xs : 2
									}
								}}
							>
								<Zoom
									// overlayBgColorStart="rgba(255, 255, 255, 0)"
									// overlayBgColorEnd="rgba(255, 255, 255, 0)"
									zoomMargin={40}
								>
									<StyledImg
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
								sx={{ mt: 1, mb: 1 }}
								justifyContent="center"
								alignItems="center"
								spacing={1}
							>
								<Grid item>
									<StatsBoxes variant="full" stats={data.games[index].stats} type="rating" />
								</Grid>
								<Grid item>
									<StatsBoxes variant="full" stats={data.games[index].stats} type="rank" />
								</Grid>
								<Grid item>
									<StatsBoxes
										variant="full"
										complexity={data.games[index].complexity}
										type="complexity"
									/>
								</Grid>
							</Grid>

							{/* Desginers and language dependence */}
							<Grid item sx={{ mt: 0.5 }}>
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
											<Box ml={0.5}>
												{data.games[index].languageDependence === null ? (
													'Not enough votes'
												) : (
													data.games[index].languageDependence
												)}
											</Box>
										</Box>
									</Typography>
								</Box>
							</Grid>

							{/* Game info */}
							<Grid
								item
								container
								sx={{
									mt    : 0.5,
									width : {
										xs : '90%',
										sm : '70%',
										md : '90%'
									}
								}}
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

							<Grid sx={{ mt: 2 }} item container justifyContent="center" alignItems="center">
								{data.mode === 'sell' && (
									<Box fontWeight="fontWeightMedium">
										<Box>{data.totalPrice} RON</Box>
									</Box>
								)}

								<SendMessage recipientUsername={data.addedBy.username} />
								<SaveGameButton altId={altId} addedById={data.addedBy._id} />
							</Grid>
						</Grid>
					</Grid>

					<Divider light />

					{/* Shipping */}
					<Box display="flex" alignItems="center">
						<LocalShippingTwoToneIcon color="primary" fontSize="small" />
						<Box ml={1} fontSize="1rem">
							Shipping
						</Box>
					</Box>
					<Grid container>
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
											<StyledChipsBox>
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
											</StyledChipsBox>
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

					<Box ref={galleryRef} display="flex" alignItems="center" mt={2}>
						{isLoadingGallery ? (
							<Loader size={20} />
						) : (
							<ImageTwoToneIcon color="primary" fontSize="small" />
						)}

						<Box ml={1} fontSize="1rem">
							Gallery
						</Box>
					</Box>

					{isErrorGallery && (
						<Fragment>
							<CustomAlert severity="warning">{errorGallery.response.data.message}</CustomAlert>
						</Fragment>
					)}

					{isSuccessGallery &&
					galleryData[index].length > 0 && (
						<Box>
							<ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 600: 3, 900: 4 }}>
								<Masonry gutter="10px">
									{galleryData[index].map((obj, i) => (
										<Box
											key={obj.imageid}
											borderRadius="4px"
											boxShadow={2}
											p={1.5}
											bgcolor="background.paper"
										>
											<LazyLoad offset={200} once>
												<StyledMasonryImg
													onClick={() => handleOpenImage(i)}
													src={obj.thumbnail}
													alt={obj.caption}
												/>
											</LazyLoad>
										</Box>
									))}
								</Masonry>
							</ResponsiveMasonry>

							<Dialog
								fullScreen
								open={open}
								TransitionComponent={Slide}
								transitionDuration={350}
								TransitionProps={{ direction: 'up' }}
							>
								<DialogTitle>
									<Box display="flex" alignItems="center">
										<Box display="flex" flexDirection="column" flexGrow={1} gap={0.5}>
											<Box fontSize="1rem">{galleryData[index][imgIndex].caption}</Box>
											<Box fontSize="0.75rem" color="grey.500">
												{`Posted on BGG by ${galleryData[index][imgIndex].postedBy}`}
											</Box>
										</Box>
										<IconButton onClick={handleCloseImage} color="secondary" size="large">
											<CloseIcon />
										</IconButton>
									</Box>
								</DialogTitle>

								<DialogContent
									dividers
									sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
								>
									<StyledDialogImg
										alt={galleryData[index][imgIndex].caption}
										src={galleryData[index][imgIndex].image}
										hidden={!imgLoaded}
										onLoad={onImgLoad}
									/>

									{!imgLoaded && (
										<Box p={10} display="flex" justifyContent="center" alignItems="center">
											<Loader />
										</Box>
									)}
								</DialogContent>

								<DialogActions>
									<Box width="100%" display="flex" alignItems="center">
										<Box flexGrow={1}>
											<CustomTooltip title="Previous image">
												<IconButton
													disabled={imgIndex === 0}
													color="primary"
													onClick={() => cycleImages('back')}
													size="large"
												>
													<ArrowBackIcon />
												</IconButton>
											</CustomTooltip>
											<CustomTooltip title="Next image">
												<IconButton
													disabled={galleryData[index].length === imgIndex + 1}
													color="primary"
													onClick={() => cycleImages('forward')}
													size="large"
												>
													<ArrowForwardIcon />
												</IconButton>
											</CustomTooltip>
										</Box>

										<Button
											color="primary"
											variant="outlined"
											href={`https://boardgamegeek.com${galleryData[index][imgIndex].extLink}`}
											target="_blank"
											rel="noopener"
										>
											See on BGG
										</Button>
									</Box>
								</DialogActions>
							</Dialog>
						</Box>
					)}

					{isSuccessGallery &&
					galleryData[index].length === 0 && <CustomAlert severity="warning">No images found</CustomAlert>}

					<Divider light />

					{/* Chips */}
					<StyledChipsBox>
						<Chips categories={data.games[index].categories} mechanics={data.games[index].mechanics} />
					</StyledChipsBox>
				</Fragment>
			)}
		</Fragment>
	)
}

export default SingleGameScreen
