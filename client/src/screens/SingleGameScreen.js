// @ Modules
import React, { useState, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Zoom from 'react-medium-image-zoom'
import { parseEntities } from 'parse-entities'
import 'react-medium-image-zoom/dist/styles.css'
import { calculateTimeAgoStrict } from '../helpers/helpers'

// @ Mui
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'

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
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import AllOutOutlinedIcon from '@mui/icons-material/AllOutOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined'

// @ Components
import CustomAvatar from '../components/CustomAvatar'
import CustomIconBtn from '../components/CustomIconBtn'
import CustomDivider from '../components/CustomDivider'
import StatsBoxes from '../components/StatsBoxes'
import InfoBox from '../components/InfoBox'
import SaveGameButton from '../components/SaveGameButton'
import Loader from '../components/Loader'
import ReportForm from '../components/ReportForm'
import SendMessage from '../components/SendMessage'
import CustomAlert from '../components/CustomAlert'
import ExtLinkIconBtn from '../components/ExtLinkIconBtn'
import GameGallery from '../components/GameGallery'
import GameRecs from '../components/GameRecs'
import GameVids from '../components/GameVids'

// @ Others
import { useGetSingleGameQuery } from '../hooks/hooks'

const StyledChipsBox = styled(Box)(({ theme }) => ({
	display        : 'flex',
	justifyContent : 'center',
	flexWrap       : 'wrap',
	gap            : theme.spacing(1)
}))

const StyledCoverImg = styled('img')(({ theme }) => ({
	objectFit                      : 'contain',
	width                          : '100%',
	overflow                       : 'hidden',
	[theme.breakpoints.down('md')]: {
		height : '240px'
	},
	[theme.breakpoints.up('md')]: {
		height : '320px'
	}
}))

const StyledUserImg = styled('img')({
	imageRendering : '-webkit-optimize-contrast',
	verticalAlign  : 'middle',
	maxHeight      : '100%',
	width          : '100%',
	objectFit      : 'cover',
	cursor         : 'zoom-in',
	borderRadius   : '4px'
})

const StyledDialogImg = styled('img')({
	maxHeight : '100%',
	width     : '100%',
	objectFit : 'contain'
})

const StyledParagraph = styled('p')({
	marginTop : 0
})

// @ Main
const SingleGameScreen = () => {
	const params = useParams()
	const { altId } = params
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const [ idx, setIdx ] = useState(0)

	const [ showMoreDescription, setShowMoreDescription ] = useState(false)
	const [ openUserImageDialog, setOpenUserImageDialog ] = useState(false)
	const { isLoading, isError, error, data, isSuccess } = useGetSingleGameQuery(altId)

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const handleOpenUserImageDialog = () => {
		setOpenUserImageDialog(true)
	}

	const handleCloseUserImageDialog = () => {
		setOpenUserImageDialog(false)
	}

	const cycleGames = (type) => {
		if (type === 'back') {
			if (idx > 0) {
				setIdx(idx - 1)
			}
		}
		if (type === 'forward') {
			if (data.games.length > idx + 1) {
				setIdx(idx + 1)
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
				<Box display="flex" alignItems="center" width="100%" gap={1}>
					<Box width="100%">
						<CustomAlert>{error.response.data.message}</CustomAlert>
					</Box>
				</Box>
			)}

			{isSuccess && (
				<Fragment>
					{data.isPack && (
						<Box
							sx={{
								display   : 'flex',
								position  : 'fixed',
								left      : '50%',
								bottom    : (theme) => theme.spacing(5),
								transform : 'translate(-50%, 0)',
								zIndex    : 1000,
								gap       : 3
							}}
						>
							<Fab color="secondary" disabled={idx === 0} onClick={() => cycleGames('back')}>
								<ArrowBackIcon />
							</Fab>
							<Box>
								<Fab
									color="secondary"
									disabled={data.games.length === idx + 1}
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
								xs : 'auto',
								md : 'auto min-content' // auto min-content sau auto-auto sau auto 1fr
							},
							gap                 : 2
						}}
						mb={2}
					>
						<Box
							component={Paper}
							id="cover"
							display="flex"
							alignItems="center"
							justifyContent="center"
							boxShadow={1}
							p={2}
							borderRadius="4px"
						>
							<Zoom
								zoomMargin={16}
								overlayBgColorStart="rgba(0,0,0,0)"
								overlayBgColorEnd="rgba(0,0,0,0.5)"
							>
								<StyledCoverImg
									src={displayImageHandler(data.games[idx].image, data.games[idx].thumbnail)}
									alt={data.games[idx].title}
								/>
							</Zoom>
						</Box>

						<Box
							id="game-info"
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="flex-end"
						>
							<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium" textAlign="center">
								{data.games[idx].title}
							</Box>
							<Box fontSize="caption.fontSize" color="text.secondary">
								{`${data.mode === 'sell'
									? 'for sale'
									: data.mode === 'trade' ? 'for trade' : 'wanted'} • ${data.games[idx]
									.subtype} • ${data.games[idx].year}`}
							</Box>
							<Box display="flex" gap={1} my={2}>
								<StatsBoxes variant="full" stats={data.games[idx].stats} type="rating" />

								<StatsBoxes variant="full" stats={data.games[idx].stats} type="rank" />

								<StatsBoxes variant="full" complexity={data.games[idx].complexity} type="complexity" />
							</Box>

							<Box display="flex" alignItems="center">
								<FaceTwoToneIcon fontSize="small" color="primary" />
								<Box ml={0.5} fontSize="caption.fontSize">
									{data.games[idx].designers.length > 0 ? (
										data.games[idx].designers.join(', ')
									) : (
										'N/A'
									)}
								</Box>
							</Box>

							<Box display="flex" alignItems="center">
								<PublicTwoToneIcon fontSize="small" color="primary" />
								<Box ml={0.5} fontSize="caption.fontSize">
									{data.games[idx].languageDependence === null ? (
										'Not enough votes'
									) : (
										data.games[idx].languageDependence
									)}
								</Box>
							</Box>

							<Box
								mt={2}
								sx={{
									display             : 'grid',
									gridTemplateColumns : {
										xs : 'repeat(2, 1fr)',
										md : 'repeat(4, 1fr)'
									},
									gap                 : 1
								}}
							>
								<InfoBox
									data={
										data.games[idx].minPlayers === data.games[idx].maxPlayers ? (
											`${data.games[idx].maxPlayers} players`
										) : (
											`${data.games[idx].minPlayers} - ${data.games[idx].maxPlayers} players`
										)
									}
								>
									<PeopleAltTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>

								<InfoBox
									data={
										data.games[idx].suggestedPlayers ? (
											`${data.games[idx].suggestedPlayers} players`
										) : (
											'N/A'
										)
									}
								>
									<PersonAddTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>

								<InfoBox data={data.games[idx].playTime ? `${data.games[idx].playTime} min.` : 'N/A'}>
									<AccessTimeTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>

								<InfoBox data={data.games[idx].minAge ? `${data.games[idx].minAge}` : 'N/A'}>
									<ChildCareTwoToneIcon fontSize="small" color="primary" />
								</InfoBox>
							</Box>

							<Box
								component={Paper}
								mt={2}
								p={1}
								px={2}
								display="flex"
								alignItems="center"
								justifyContent={data.mode === 'sell' ? 'space-between' : 'center'}
								boxShadow={1}
								borderRadius="4px"
								width="100%"
							>
								<Box display="flex" alignItems="center" gap={1}>
									<ReportForm edge="start" type="game" altId={data.altId} />
									<ExtLinkIconBtn
										url={`https://boardgamegeek.com/boardgame/${data.games[idx].bggId}`}
									/>
									<SendMessage recipientUsername={data.addedBy.username} />
									{data.mode !== 'want' && (
										<SaveGameButton altId={altId} addedById={data.addedBy._id} />
									)}
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
								component={Paper}
								display="flex"
								flexDirection="column"
								gap={2}
								id="information"
								width="100%"
								p={2}
								boxShadow={1}
								borderRadius="4px"
							>
								<Box display="flex" alignItems="center" gap={2}>
									<InfoTwoToneIcon color="primary" />
									<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
										Information
									</Box>
								</Box>

								<Box display="flex" alignItems="center" fontSize="1rem">
									<Box mr={1} fontWeight="fontWeightMedium">{`Added ${calculateTimeAgoStrict(
										data.createdAt
									)} by`}</Box>
									<CustomAvatar size={4} username={data.addedBy.username} src={data.addedBy.avatar} />
									<Box ml={1} fontWeight="fontWeightMedium">
										{data.addedBy.username}
									</Box>
								</Box>

								{data.mode === 'want' && (
									<Box display="flex" gap={0.5} flexWrap="wrap">
										{data.games[idx].prefMode.buy && (
											<Chip size="small" color="primary" label="prefer to buy" />
										)}

										{data.games[idx].prefMode.trade && (
											<Chip size="small" color="primary" label="prefer to trade" />
										)}

										<Chip
											size="small"
											color="primary"
											label={`prefer ${data.games[idx].prefVersion.title} • ${data.games[idx]
												.prefVersion.year}`}
										/>
									</Box>
								)}

								{data.mode !== 'want' && (
									<Box display="flex" gap={0.5} flexWrap="wrap">
										<Chip size="small" color="primary" label={data.games[idx].condition} />
										<Chip
											size="small"
											color="primary"
											label={`${data.games[idx].version.title} (${data.games[idx].version.year})`}
										/>
										<Chip
											size="small"
											color={data.games[idx].isSleeved ? 'success' : 'default'}
											label={data.games[idx].isSleeved ? 'Sleeved' : 'Not sleeved'}
										/>
									</Box>
								)}

								{data.games[idx].extraInfo && (
									<Box display="flex" flexDirection="column">
										<Box fontWeight="fontWeightMedium">Extra info</Box>
										<Box fontWeight="fontWeightMedium" fontSize={14}>
											{data.games[idx].extraInfo}
										</Box>
									</Box>
								)}

								{data.isPack &&
								data.extraInfoPack && (
									<Box display="flex" flexDirection="column">
										<Box fontWeight="fontWeightMedium">Pack info</Box>
										<Box fontWeight="fontWeightMedium" fontSize={14}>
											{data.extraInfoPack}
										</Box>
									</Box>
								)}

								{data.games[idx].userImage && (
									<Box display="flex" flexDirection="column" gap={0.5}>
										<Box fontWeight="fontWeightMedium">User image</Box>
										<Box width="160px" height="90px">
											<StyledUserImg
												onClick={handleOpenUserImageDialog}
												src={data.games[idx].userImage.thumbnail}
												alt={data.games[idx].userImage.name}
											/>
										</Box>

										<Dialog
											maxWidth="lg"
											onClose={handleCloseUserImageDialog}
											position="relative"
											open={openUserImageDialog}
											transitionDuration={350}
										>
											<CustomIconBtn
												sx={{ position: 'absolute', top: '8px', right: '8px' }}
												onClick={handleCloseUserImageDialog}
												size="large"
												color="error"
											>
												<CloseIcon />
											</CustomIconBtn>

											<DialogContent
												sx={{
													display        : 'flex',
													justifyContent : 'center',
													alignItems     : 'center',
													p              : 0
												}}
											>
												<StyledDialogImg
													src={data.games[idx].userImage.full}
													alt={data.games[idx].userImage.name}
												/>
											</DialogContent>
										</Dialog>
									</Box>
								)}

								{data.games[idx].description && (
									<Box display="flex" flexDirection="column">
										<Box fontWeight="fontWeightMedium">Description</Box>
										<Box>
											<Collapse in={showMoreDescription} collapsedSize={50} timeout="auto">
												<Box
													fontStyle="italic"
													color="text.secondary"
													fontSize="caption.fontSize"
												>
													{data.games[idx].description
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
							<Box id="shipping">
								<Box
									component={Paper}
									display="flex"
									flexDirection="column"
									gap={2}
									width="100%"
									p={2}
									boxShadow={1}
									borderRadius="4px"
								>
									<Box display="flex" alignItems="center" gap={2}>
										<LocalShippingTwoToneIcon color="primary" />
										<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
											Shipping
										</Box>
									</Box>

									{(data.mode === 'want' || data.mode === 'trade') && (
										<Fragment>
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
														<Box textAlign="center">Shipping by post is preferred</Box>
													</Fragment>
												) : (
													<Fragment>
														<CancelRoundedIcon color="error" />
														<Box textAlign="center">Shipping by post is not preferred</Box>
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
														<MarkunreadMailboxTwoToneIcon color="primary" />
														<Box textAlign="center">Shipping by courier is preferred</Box>
													</Fragment>
												) : (
													<Fragment>
														<CancelRoundedIcon color="error" />
														<Box textAlign="center">
															Shipping by courier is not preferred
														</Box>
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
														<Box textAlign="center">Personal shipping is preferred</Box>
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
														<Box textAlign="center">Personal shipping is not preferred</Box>
													</Fragment>
												)}
											</Box>
										</Fragment>
									)}

									{data.mode === 'sell' && (
										<Fragment>
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
														<Box textAlign="center">{`Shipping by post paid by ${data
															.shipping.shipPostPayer === 'seller'
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
														<Box textAlign="center">{`Shipping by courier paid by ${data
															.shipping.shipPostPayer === 'seller'
															? `${data.addedBy.username}`
															: 'buyer'}`}</Box>
													</Fragment>
												) : (
													<Fragment>
														<CancelRoundedIcon color="error" />
														<Box textAlign="center">
															Shipping by courier is not available
														</Box>
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
										</Fragment>
									)}
								</Box>
							</Box>
						</Box>
					</Box>

					<CustomDivider light />

					{/* Gallery */}
					<GameGallery idx={idx} />

					<CustomDivider light />

					{/* Recommendations */}
					<GameRecs idx={idx} />

					<CustomDivider light />

					{/* Videos */}
					<GameVids idx={idx} />

					<CustomDivider light />

					{/* Chips */}
					<StyledChipsBox sx={{ my: 2 }}>
						{data.games[idx].parent && (
							<Chip
								sx={{ maxWidth: '100%' }}
								icon={<DonutSmallOutlinedIcon />}
								label={`Expansion for ${data.games[idx].parent.title}`}
								color="success"
							/>
						)}

						{data.games[idx].expansions.length > 15 ? (
							<Chip
								sx={{ maxWidth: '100%' }}
								icon={<AllOutOutlinedIcon />}
								key="expansions"
								label="More than 15 expansions available"
								color="warning"
							/>
						) : (
							data.games[idx].expansions.map((exp) => (
								<Chip
									sx={{ maxWidth: '100%' }}
									icon={<AllOutOutlinedIcon />}
									key={exp.bggId}
									label={exp.title}
									color="warning"
								/>
							))
						)}

						{data.games[idx].categories.map((ctg) => (
							<Chip key={ctg.id} icon={<CategoryOutlinedIcon />} label={ctg.name} color="secondary" />
						))}

						{data.games[idx].mechanics.map((mec) => (
							<Chip key={mec.id} icon={<SettingsOutlinedIcon />} label={mec.name} color="primary" />
						))}
					</StyledChipsBox>
				</Fragment>
			)}
		</Fragment>
	)
}

export default SingleGameScreen
