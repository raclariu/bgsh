// @ Modules
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

// @ Mui
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// @ Icons
import BlockIcon from '@mui/icons-material/Block'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'
import CloseIcon from '@mui/icons-material/Close'

// @ Components
import CustomDivider from './CustomDivider'
import CustomAvatar from './CustomAvatar'
import CustomTooltip from './CustomTooltip'
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomIconBtn from './CustomIconBtn'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

// @ Styles
const StyledCardMedia = styled(CardMedia)({
	objectFit : 'contain',
	height    : '180px'
})

const StyledCoverImg = styled('img')({
	objectFit    : 'contain',
	height       : '150px',
	overflow     : 'hidden',
	borderRadius : '4px'
})

const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

// @ Details
const HistoryGameDetails = ({ data, cycleIndex, index }) => {
	const [ openDialog, setOpenDialog ] = useState(false)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	return (
		<Fragment>
			<CustomTooltip title="Details">
				<CustomIconBtn onClick={handleOpenDialog} color="primary" size="large">
					<CenterFocusWeakTwoToneIcon />
				</CustomIconBtn>
			</CustomTooltip>

			<Dialog fullWidth maxWidth="sm" open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					<Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
						<Box display="flex" flexDirection="column" gap={0.5}>
							<Box fontSize="h6.fontSize">{data.games[index].title}</Box>
							<Box fontSize="caption.fontSize" color="grey.500">
								{`${data.games[index].subtype} • ${data.games[index].year}`}
							</Box>
						</Box>
						<CustomIconBtn onClick={handleCloseDialog} color="error" size="large">
							<CloseIcon color="error" />
						</CustomIconBtn>
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box
						display="grid"
						sx={{
							gridTemplateColumns : {
								xs : '100%',
								md : 'min-content auto'
							},
							gap                 : 2
						}}
					>
						<Box display="flex" alignItems="flex-start" justifyContent="center">
							<StyledCoverImg src={data.games[index].thumbnail} alt={data.games[index].title} />
						</Box>
						<Box display="flex" flexDirection="column" justifyContent="flex-start" gap={1}>
							{data.otherUser ? (
								<Chip
									color="warning"
									variant="outlined"
									label={
										<Box display="flex" alignItems="center" gap={1}>
											<Box fontWeight="fontWeightMedium">
												{data.mode === 'sell' ? (
													'Sold to'
												) : data.mode === 'trade' ? (
													'Traded with'
												) : (
													'Bought from'
												)}
											</Box>
											<CustomAvatar
												size={3}
												username={data.otherUser.username}
												src={data.otherUser.avatar}
											/>
											<Box fontWeight="fontWeightMedium">{data.otherUser.username}</Box>
										</Box>
									}
								/>
							) : (
								<Chip
									color="primary"
									variant="outlined"
									label={
										data.mode === 'sell' ? (
											'You have not specified the buyer'
										) : data.mode === 'trade' ? (
											'You have not specified the other trader'
										) : (
											'You have not specified the seller'
										)
									}
								/>
							)}
							<Chip
								sx={{ maxWidth: '100%' }}
								color="primary"
								variant="outlined"
								label={formatDate(data.createdAt)}
							/>
							<Chip
								sx={{ maxWidth: '100%' }}
								color="primary"
								variant="outlined"
								label={`${data.games[index].version.title} • ${data.games[index].year}`}
							/>
							{(data.mode === 'sell' || data.mode === 'buy') && (
								<Chip sx={{ alignSelf: 'center' }} color="success" label={`${data.finalPrice} RON`} />
							)}

							{data.isPack &&
							data.extraInfo && (
								<Box component={'p'} fontSize="0.875rem">
									{data.extraInfo}
								</Box>
							)}

							{!data.isPack &&
							data.games[index].extraInfo && (
								<Box component={'p'} fontSize="0.875rem">
									{data.games[index].extraInfo}
								</Box>
							)}
						</Box>
					</Box>
				</DialogContent>

				<DialogActions>
					<Box
						display="flex"
						alignItems="center"
						justifyContent={data.isPack ? 'space-between' : 'flex-end'}
						width="100%"
					>
						{data.isPack && (
							<Box display="flex" gap={2} alignItems="center">
								<CustomTooltip title="Previous">
									<CustomIconBtn
										color="primary"
										disabled={index === 0}
										onClick={() => cycleIndex('back')}
										size="large"
									>
										<ArrowBackIcon />
									</CustomIconBtn>
								</CustomTooltip>

								<CustomTooltip title="Next">
									<CustomIconBtn
										color="primary"
										disabled={data.games.length === index + 1}
										onClick={() => cycleIndex('forward')}
										size="large"
									>
										<ArrowForwardIcon />
									</CustomIconBtn>
								</CustomTooltip>
							</Box>
						)}

						<ExtLinkIconBtn url={`https://boardgamegeek.com/boardgame/${data.games[index].bggId}`} />
					</Box>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

// @ Main
const HistoryGameCard = ({ data }) => {
	const [ index, setIndex ] = useState(0)

	const cycleIndex = (type) => {
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
		<Card sx={{ position: 'relative' }} elevation={2}>
			<Box display="flex" flexDirection="column" p={1} gap={1}>
				<StyledCardMedia
					component="img"
					image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
					alt={data.games[index].title}
					title={data.games[index].title}
				/>
			</Box>

			{data.games.length > 1 && (
				<Chip
					sx={{
						position : 'absolute',
						top      : '8px',
						left     : '8px'
					}}
					size="small"
					color="secondary"
					label={`${data.games.length} pack`}
				/>
			)}

			<CustomDivider />

			<CardContent>
				<Box
					display="flex"
					justifyContent={data.isPack ? 'space-between' : 'center'}
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					{data.isPack ? (
						<Fragment>
							<CustomIconBtn
								color="primary"
								disabled={index === 0}
								onClick={() => cycleIndex('back')}
								edge="start"
							>
								<ArrowBackIcon />
							</CustomIconBtn>
							<StyledTitleBox>
								{data.games[index].title} ({data.games[index].year})
							</StyledTitleBox>
							<CustomIconBtn
								color="primary"
								disabled={data.games.length === index + 1}
								onClick={() => cycleIndex('forward')}
								edge="end"
							>
								<ArrowForwardIcon />
							</CustomIconBtn>
						</Fragment>
					) : (
						<StyledTitleBox>
							{data.games[index].title} ({data.games[index].year})
						</StyledTitleBox>
					)}
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" alignItems="center" justifyContent="flex-end" width="100%">
					<HistoryGameDetails data={data} cycleIndex={cycleIndex} index={index} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default HistoryGameCard
