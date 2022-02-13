// @ Libraries
import React, { useEffect, useState, Fragment, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import Zoom from 'react-medium-image-zoom'
import { useInView } from 'react-intersection-observer'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import 'react-medium-image-zoom/dist/styles.css'
import approx from 'approximate-number'
import { parseEntities } from 'parse-entities'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Mui
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
import Collapse from '@mui/material/Collapse'
import Skeleton from '@mui/material/Skeleton'

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
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import StarPurple500Icon from '@mui/icons-material/StarPurple500'
import RecommendTwoToneIcon from '@mui/icons-material/RecommendTwoTone'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import AllOutIcon from '@mui/icons-material/AllOut'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined'
import AllOutOutlinedIcon from '@mui/icons-material/AllOutOutlined'
import CribOutlinedIcon from '@mui/icons-material/CribOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined'

// @ Components
import CustomAvatar from '../components/CustomAvatar'
import CustomIconBtn from '../components/CustomIconBtn'
import CustomDivider from '../components/CustomDivider'
import StatsBoxes from '../components/SingleGameScreen/StatsBoxes'
import InfoBox from '../components/SingleGameScreen/InfoBox'
import SaveGameButton from '../components/SaveGameButton'
import Loader from '../components/Loader'
import SendMessage from '../components/SendMessage'
import HelmetComponent from '../components/HelmetComponent'
import CustomAlert from '../components/CustomAlert'
import CustomTooltip from '../components/CustomTooltip'
import LzLoad from '../components/LzLoad'
import CustomButton from '../components/CustomButton'

// @ Others
import {
	useGetSingleGameQuery,
	useGetSingleGameGalleryQuery,
	useGetSingleGameRecommendationsQuery
} from '../hooks/hooks'

const StyledChipsBox = styled(Box)(({ theme }) => ({
	display        : 'flex',
	justifyContent : 'center',
	flexWrap       : 'wrap',
	gap            : theme.spacing(1)
}))

const StyledCoverImg = styled('img')({
	objectFit    : 'contain',
	width        : '100%',
	overflow     : 'hidden',
	borderRadius : '8px'
})

const StyledMasonryImg = styled('img')({
	imageRendering : '-webkit-optimize-contrast',
	verticalAlign  : 'middle',
	maxHeight      : '100%',
	width          : '100%',
	objectFit      : 'contain',
	cursor         : 'zoom-in',
	borderRadius   : '8px'
})

const StyledUserImg = styled('img')({
	imageRendering : '-webkit-optimize-contrast',
	verticalAlign  : 'middle',
	maxHeight      : '100%',
	width          : '100%',
	objectFit      : 'cover',
	cursor         : 'zoom-in',
	borderRadius   : '8px'
})

const StyledDialogImg = styled('img')({
	maxHeight : '100%',
	width     : '100%',
	objectFit : 'contain'
})

const StyledRecImg = styled('img')({
	verticalAlign : 'bottom',
	objectFit     : 'cover',
	maxWidth      : 60,
	height        : 60,
	borderRadius  : '8px'
})

const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	fontSize        : 14
})

const StyledParagraph = styled('p')({
	marginTop : 0
})

// @ Gallery skeleton
const GallerySkeleton = () => {
	return (
		<Box
			borderRadius={1}
			boxShadow={1}
			p={1}
			bgcolor="background.paper"
			width="100%"
			height={Math.floor(Math.random() * (270 - 100 + 1) + 100)}
		>
			<Skeleton animation="wave" variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
		</Box>
	)
}

// @ Recs skeleton
const RecsSkeleton = () => {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Box p={1} display="flex" boxShadow={1} borderRadius={1} bgcolor="background.paper" gap={1} width="100%">
				<Box>
					<Skeleton animation="wave" variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
				</Box>
				<Box display="flex" flexDirection="column" width="100%" justifyContent="center">
					<Skeleton animation="wave" variant="text" width="70%" />
					<Skeleton animation="wave" variant="text" width="45%" />
				</Box>
			</Box>
		</Grid>
	)
}

// @ Main
const SingleGameScreen = () => {
	const params = useParams()
	const { altId } = params
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const { ref: galleryRef, inView: galleryInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const { ref: recsRef, inView: recsInView } = useInView({
		threshold   : 0,
		triggerOnce : true,
		delay       : 200
	})

	const [ index, setIndex ] = useState(0)
	const [ imgIndex, setImgIndex ] = useState(0)
	const [ openGalleryDialog, setOpenGalleryDialog ] = useState(false)
	const [ openUserImageDialog, setOpenUserImageDialog ] = useState(false)
	const [ imgLoaded, setImgLoaded ] = useState(false)
	const [ expanded, setExpanded ] = useState(false)
	const [ showMoreDescription, setShowMoreDescription ] = useState(false)

	const { isLoading, isError, error, data, isSuccess } = useGetSingleGameQuery(altId)

	const {
		isFetching : isFetchingGallery,
		isError    : isErrorGallery,
		error      : errorGallery,
		data       : galleryData,
		isSuccess  : isSuccessGallery
	} = useGetSingleGameGalleryQuery({ altId, galleryInView, index })

	const {
		isFetching : isFetchingRecs,
		data       : recData,
		isSuccess  : isSuccessRec
	} = useGetSingleGameRecommendationsQuery({ altId, recsInView, index })

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const handleOpenGalleryImageDialog = (imgIndexClicked) => {
		setImgIndex(imgIndexClicked)
		setOpenGalleryDialog(true)
	}

	const handleOpenUserImageDialog = () => {
		setOpenUserImageDialog(true)
	}

	const handleCloseUserImageDialog = () => {
		setOpenUserImageDialog(false)
	}

	const handleCloseGalleryImageDialog = () => {
		setOpenGalleryDialog(false)
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
			if (galleryData.length > imgIndex + 1) {
				setImgLoaded(false)
				setImgIndex(imgIndex + 1)
			}
		}
	}

	console.log(data && data)

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
								transform : 'translate(-50%, 0)',
								zIndex    : 1000,
								gap       : 3
							}}
						>
							<Fab color="secondary" disabled={index === 0} onClick={() => cycleGames('back')}>
								<ArrowBackIcon />
							</Fab>
							<Box>
								<Fab
									color="secondary"
									disabled={data.games.length === index + 1}
									onClick={() => cycleGames('forward')}
								>
									<ArrowForwardIcon />
								</Fab>
							</Box>
						</Box>
					)}

					<Box
						sx={{
							display             : 'grid',
							gridTemplateColumns : {
								xs : '100%',
								md : '2fr 3fr'
							},
							gap                 : 2
						}}
						mb={2}
					>
						<Box
							display="flex"
							alignItems="center"
							justifyContent="center"
							boxShadow={1}
							p={2}
							bgcolor="background.paper"
						>
							<Zoom
								zoomMargin={16}
								overlayBgColorStart="rgba(0,0,0,0)"
								overlayBgColorEnd="rgba(0,0,0,0.7)"
							>
								<StyledCoverImg
									src={displayImageHandler(data.games[index].image, data.games[index].thumbnail)}
									alt={data.games[index].title}
									sx={{
										height : {
											xs : '220px',
											md : '320px'
										}
									}}
								/>
							</Zoom>
						</Box>

						<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
							<Box fontSize="1.5rem" fontWeight="fontWeightMedium" textAlign="center">
								{data.games[index].title}
							</Box>
							<Box fontSize={'0.75rem'} fontStyle="italic" color="grey.500">
								{`${data.games[index].subtype} • ${data.games[index].year}`}
							</Box>
							<Box display="flex" gap={1} my={2}>
								<StatsBoxes variant="full" stats={data.games[index].stats} type="rating" />

								<StatsBoxes variant="full" stats={data.games[index].stats} type="rank" />

								<StatsBoxes
									variant="full"
									complexity={data.games[index].complexity}
									type="complexity"
								/>
							</Box>

							<Box display="flex" alignItems="center">
								<FaceTwoToneIcon fontSize="small" color="primary" />
								<Box ml={0.5} fontSize="0.75rem">
									{data.games[index].designers.length > 0 ? (
										data.games[index].designers.join(', ')
									) : (
										'N/A'
									)}
								</Box>
							</Box>

							<Box display="flex" alignItems="center">
								<PublicTwoToneIcon fontSize="small" color="primary" />
								<Box ml={0.5} fontSize="0.75rem">
									{data.games[index].languageDependence === null ? (
										'Not enough votes'
									) : (
										data.games[index].languageDependence
									)}
								</Box>
							</Box>

							<Box
								mt={2}
								display="grid"
								sx={{
									gridTemplateColumns : {
										xs : 'repeat(2, 1fr)',
										md : 'repeat(4, 1fr)'
									},
									gap                 : 1
								}}
							>
								<InfoBox
									data={`${data.games[index].minPlayers} - ${data.games[index].maxPlayers} players`}
								>
									<PeopleAltTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>

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

								<InfoBox
									data={data.games[index].playTime ? `${data.games[index].playTime} min.` : 'N/A'}
								>
									<AccessTimeTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>

								<InfoBox data={data.games[index].minAge ? `${data.games[index].minAge}` : 'N/A'}>
									<ChildCareTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>
							</Box>

							<Box
								mt={2}
								p={1}
								px={2}
								display="flex"
								alignItems="center"
								justifyContent={data.mode === 'sell' ? 'space-between' : 'center'}
								boxShadow={1}
								borderRadius={1}
								bgcolor="background.paper"
								width="100%"
							>
								<Box display="flex" alignItems="center" gap={1}>
									<SendMessage recipientUsername={data.addedBy.username} />
									<SaveGameButton altId={altId} addedById={data.addedBy._id} />
								</Box>
								{data.mode === 'sell' && (
									<Box fontWeight="fontWeightMedium" fontSize="1.5rem" color="success.main">
										{data.totalPrice} RON
									</Box>
								)}
							</Box>
						</Box>
					</Box>

					<CustomDivider light />

					{/* Information */}
					<Box my={2}>
						<Box
							sx={{
								display             : 'grid',
								gridTemplateColumns : {
									xs : '100%',
									md : '3fr auto 2fr'
								},
								gap                 : 2
							}}
						>
							<Box
								display="flex"
								flexDirection="column"
								gap={2}
								id="information"
								width="100%"
								p={2}
								boxShadow={1}
								borderRadius={1}
								bgcolor="background.paper"
							>
								<Box display="flex" alignItems="center" gap={1}>
									<InfoTwoToneIcon color="primary" />
									<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
										Information
									</Box>
								</Box>

								<Box display="flex" alignItems="center" fontSize="1rem">
									<Box mr={1} fontWeight="fontWeightMedium">{`Added ${calculateTimeAgo(
										data.createdAt
									)} by`}</Box>
									<CustomAvatar size={4} username={data.addedBy.username} src={data.addedBy.avatar} />
									<Box ml={1} fontWeight="fontWeightMedium">
										{data.addedBy.username}
									</Box>
								</Box>

								<Box display="flex" gap={0.5} flexWrap="wrap">
									<Chip size="small" color="primary" label={data.games[index].condition} />
									<Chip
										size="small"
										color="primary"
										label={`${data.games[index].version.title} (${data.games[index].version.year})`}
									/>
									<Chip
										size="small"
										color={data.games[index].isSleeved ? 'primary' : 'secondary'}
										label={data.games[index].isSleeved ? 'Sleeved' : 'Not sleeved'}
									/>
								</Box>

								{data.games[index].extraInfo && (
									<Box display="flex" flexDirection="column">
										<Box fontWeight="fontWeightMedium">Extra info</Box>
										<Box fontStyle="italic" fontSize={12}>
											{data.games[index].extraInfo}
										</Box>
									</Box>
								)}

								{data.isPack && (
									<Box display="flex" flexDirection="column">
										<Box fontWeight="fontWeightMedium">Pack info</Box>
										<Box fontStyle="italic" fontSize={12}>
											{data.extraInfoPack}
										</Box>
									</Box>
								)}

								{data.games[index].userImage && (
									<Box display="flex" flexDirection="column" gap={0.5}>
										<Box fontWeight="fontWeightMedium">User image</Box>
										<Box width="160px" height="90px">
											<StyledUserImg
												onClick={handleOpenUserImageDialog}
												src={data.games[index].userImage.thumbnail}
												alt={data.games[index].userImage.name}
											/>
										</Box>

										<Dialog
											fullScreen
											open={openUserImageDialog}
											TransitionComponent={Slide}
											transitionDuration={350}
											TransitionProps={{ direction: 'up' }}
										>
											<DialogTitle>
												<Box display="flex" justifyContent="flex-end" width="100%">
													<CustomIconBtn
														onClick={handleCloseUserImageDialog}
														color="secondary"
														size="large"
													>
														<CloseIcon />
													</CustomIconBtn>
												</Box>
											</DialogTitle>

											<DialogContent
												sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
											>
												<StyledDialogImg
													src={data.games[index].userImage.full}
													alt={data.games[index].userImage.name}
												/>
											</DialogContent>
										</Dialog>
									</Box>
								)}

								{data.games[index].description && (
									<Box display="flex" flexDirection="column">
										<Box fontWeight="fontWeightMedium">Game description</Box>
										<Box>
											<Collapse in={showMoreDescription} collapsedSize={50} timeout="auto">
												<Box fontStyle="italic" fontSize={12}>
													{data.games[index].description
														.split('&#10;')
														.filter((part) => part.trim().length !== 0)
														.map((txt, i) => (
															<StyledParagraph key={i}>
																{parseEntities(txt)}
															</StyledParagraph>
														))}
												</Box>
											</Collapse>
										</Box>

										<Box alignSelf="flex-end" fontSize={12} mt={1}>
											<Link
												sx={{ cursor: 'pointer' }}
												underline="none"
												onClick={() => setShowMoreDescription((val) => !val)}
											>
												{showMoreDescription ? 'Show less' : 'Show more'}
											</Link>
										</Box>
									</Box>
								)}
							</Box>

							<CustomDivider orientation={matches ? 'vertical' : 'horizontal'} flexItem />

							{/* Shipping */}
							<Box
								display="flex"
								flexDirection="column"
								gap={2}
								id="shipping"
								width="100%"
								p={2}
								boxShadow={1}
								borderRadius={1}
								bgcolor="background.paper"
							>
								<Box display="flex" alignItems="center" gap={1}>
									<LocalShippingTwoToneIcon color="primary" />
									<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
										Shipping
									</Box>
								</Box>

								<Box
									display="flex"
									flexDirection="column"
									justifyContent="center"
									alignItems="center"
									gap={1}
								>
									{data.shipping.shipPost ? (
										<Fragment>
											<MarkunreadMailboxTwoToneIcon color="primary" />
											<Box textAlign="center">{`Shipping by post paid by ${data.shipping
												.shipPostPayer === 'seller'
												? `${data.addedBy.username}`
												: 'buyer'}`}</Box>
										</Fragment>
									) : (
										<Fragment>
											<CancelRoundedIcon color="error" />
											<Box textAlign="center">Shipping by post is not available</Box>
										</Fragment>
									)}
								</Box>

								<Box
									display="flex"
									flexDirection="column"
									justifyContent="center"
									alignItems="center"
									gap={1}
								>
									{data.shipping.shipCourier ? (
										<Fragment>
											<LocalShippingTwoToneIcon color="primary" />
											<Box textAlign="center">{`Shipping by courier paid by ${data.shipping
												.shipPostPayer === 'seller'
												? `${data.addedBy.username}`
												: 'buyer'}`}</Box>
										</Fragment>
									) : (
										<Fragment>
											<CancelRoundedIcon color="error" />
											<Box textAlign="center">Shipping by courier is not available</Box>
										</Fragment>
									)}
								</Box>

								<Box
									display="flex"
									flexDirection="column"
									justifyContent="center"
									alignItems="center"
									gap={1}
								>
									{data.shipping.shipPersonal ? (
										<Fragment>
											<LocalLibraryTwoToneIcon color="primary" />
											<Box textAlign="center">Personal shipping is available in</Box>
											<StyledChipsBox>
												{data.shipping.shipCities.map((city) => (
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
										</Fragment>
									) : (
										<Fragment>
											<CancelRoundedIcon color="error" />
											<Box textAlign="center">Personal shipping is not available</Box>
										</Fragment>
									)}
								</Box>
							</Box>
						</Box>
					</Box>

					<CustomDivider light />

					{/* Gallery */}
					<Box id="gallery" my={2} display="flex" flexDirection="column" gap={2}>
						<Box ref={galleryRef} display="flex" alignItems="center" gap={1}>
							{isFetchingGallery ? <Loader size={20} /> : <ImageTwoToneIcon color="primary" />}

							<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
								Gallery
							</Box>
						</Box>

						{isErrorGallery && (
							<CustomAlert severity="warning">{errorGallery.response.data.message}</CustomAlert>
						)}

						{isFetchingGallery && (
							<ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 600: 3, 900: 4 }}>
								<Masonry gutter="10px">
									{[ ...Array(12).keys() ].map((i, k) => <GallerySkeleton key={k} />)}
								</Masonry>
							</ResponsiveMasonry>
						)}

						{isSuccessGallery &&
						galleryData.length > 0 && (
							<Box>
								<ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 600: 3, 900: 4 }}>
									<Masonry gutter="10px">
										{galleryData.map((obj, i) => (
											<LzLoad key={obj.imageid}>
												<Box borderRadius={1} boxShadow={1} p={1} bgcolor="background.paper">
													<StyledMasonryImg
														onClick={() => handleOpenGalleryImageDialog(i)}
														src={obj.thumbnail}
														alt={obj.caption}
													/>
												</Box>
											</LzLoad>
										))}
									</Masonry>
								</ResponsiveMasonry>

								<Dialog
									fullScreen
									open={openGalleryDialog}
									TransitionComponent={Slide}
									transitionDuration={350}
									TransitionProps={{ direction: 'up' }}
								>
									<DialogTitle>
										<Box display="flex" alignItems="center">
											<Box display="flex" flexDirection="column" flexGrow={1} gap={0.5}>
												<Box fontSize="1rem">{galleryData[imgIndex].caption}</Box>
												<Box fontSize="0.75rem" color="grey.500">
													{`Posted on BGG by ${galleryData[imgIndex].postedBy}`}
												</Box>
											</Box>
											<CustomIconBtn
												onClick={handleCloseGalleryImageDialog}
												color="secondary"
												size="large"
											>
												<CloseIcon />
											</CustomIconBtn>
										</Box>
									</DialogTitle>

									<DialogContent
										dividers
										sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
									>
										<StyledDialogImg
											alt={galleryData[imgIndex].caption}
											src={galleryData[imgIndex].image}
											hidden={!imgLoaded}
											onLoad={onImgLoad}
										/>

										{!imgLoaded && (
											<Box display="flex" justifyContent="center" alignItems="center">
												<Loader />
											</Box>
										)}
									</DialogContent>

									<DialogActions>
										<Box width="100%" display="flex" alignItems="center">
											<Box flexGrow={1}>
												<CustomTooltip title="Previous image">
													<CustomIconBtn
														disabled={imgIndex === 0}
														color="primary"
														onClick={() => cycleImages('back')}
														size="large"
													>
														<ArrowBackIcon />
													</CustomIconBtn>
												</CustomTooltip>
												<CustomTooltip title="Next image">
													<CustomIconBtn
														disabled={galleryData.length === imgIndex + 1}
														color="primary"
														onClick={() => cycleImages('forward')}
														size="large"
													>
														<ArrowForwardIcon />
													</CustomIconBtn>
												</CustomTooltip>
											</Box>

											<CustomButton
												variant="outlined"
												href={`https://boardgamegeek.com${galleryData[imgIndex].extLink}`}
												target="_blank"
												rel="noreferrer"
											>
												See on BGG
											</CustomButton>
										</Box>
									</DialogActions>
								</Dialog>
							</Box>
						)}

						{isSuccessGallery &&
						galleryData.length === 0 && <CustomAlert severity="warning">No images found</CustomAlert>}
					</Box>

					<CustomDivider light />

					{/* Recommendations */}
					<Box id="recommendations" my={2} display="flex" flexDirection="column" gap={2}>
						<Box ref={recsRef} display="flex" alignItems="center" gap={1}>
							{isFetchingRecs ? <Loader size={20} /> : <RecommendTwoToneIcon color="primary" />}

							<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
								Recommendations
							</Box>
						</Box>

						{isFetchingRecs && (
							<Grid container spacing={1}>
								{[ ...Array(matches ? 12 : 4).keys() ].map((i, k) => <RecsSkeleton key={k} />)}
							</Grid>
						)}

						{isSuccessRec &&
						recData.length > 0 && (
							<Box>
								<Collapse in={expanded} timeout="auto" collapsedSize="328px">
									<Grid container spacing={1}>
										{isSuccessRec &&
											recData.map((rec) => (
												<Grid key={rec.bggId} item xs={12} sm={6} md={4}>
													<Box
														display="flex"
														p={1}
														boxShadow={1}
														borderRadius={1}
														bgcolor="background.paper"
														gap={1}
													>
														<LzLoad>
															<a
																href={`https://boardgamegeek.com/boardgame/${rec.bggId}`}
																target="_blank"
																rel="noreferrer"
															>
																<StyledRecImg src={rec.thumbnail} alt={rec.title} />
															</a>
														</LzLoad>

														<Box
															display="flex"
															flexDirection="column"
															justifyContent="center"
															width="100%"
															gap={0.5}
														>
															<StyledTitleBox fontWeight="fontWeightMedium">
																{rec.title}
															</StyledTitleBox>
															<Box display="flex" gap={1}>
																<Box
																	display="flex"
																	alignItems="center"
																	gap={0.25}
																	fontWeight="fontWeightMedium"
																	fontSize={14}
																	color="grey.500"
																>
																	<StarPurple500Icon
																		color="primary"
																		fontSize="small"
																	/>
																	{approx(rec.stats.avgRating)}
																</Box>

																<Box
																	display="flex"
																	alignItems="center"
																	gap={0.25}
																	fontWeight="fontWeightMedium"
																	fontSize={14}
																	color="grey.500"
																>
																	<MilitaryTechIcon
																		color="primary"
																		fontSize="small"
																	/>
																	{rec.stats.rank}
																</Box>
															</Box>
														</Box>
													</Box>
												</Grid>
											))}
									</Grid>
								</Collapse>

								<Box display="flex" justifyContent="flex-end" mt={1}>
									<CustomButton onClick={() => setExpanded((expanded) => !expanded)}>
										{expanded ? 'Show less' : 'Show more'}
									</CustomButton>
								</Box>
							</Box>
						)}
						{isSuccessRec &&
						recData.length === 0 && <CustomAlert severity="warning">No recommendations found</CustomAlert>}
					</Box>

					<CustomDivider light />

					{/* Chips */}
					<StyledChipsBox sx={{ my: 2 }}>
						{data.games[index].parent && (
							<Chip
								sx={{ maxWidth: '100%' }}
								icon={<DonutSmallOutlinedIcon />}
								label={`Expansion for ${data.games[index].parent.title}`}
								color="success"
							/>
						)}

						{data.games[index].expansions.length > 0 &&
							data.games[index].expansions.map((exp) => (
								<Chip
									sx={{ maxWidth: '100%' }}
									icon={<AllOutOutlinedIcon />}
									key={exp.bggId}
									label={exp.title}
									color="warning"
								/>
							))}

						{data.games[index].categories.map((ctg) => (
							<Chip key={ctg.id} icon={<CategoryOutlinedIcon />} label={ctg.name} color="secondary" />
						))}

						{data.games[index].mechanics.map((mec) => (
							<Chip key={mec.id} icon={<SettingsOutlinedIcon />} label={mec.name} color="primary" />
						))}
					</StyledChipsBox>
				</Fragment>
			)}
		</Fragment>
	)
}

export default SingleGameScreen
