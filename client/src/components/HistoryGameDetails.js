// @ Libraries
import React, { Fragment, useState } from 'react'

// @ Mui
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Chip from '@mui/material/Chip'

// @ Components
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'
import CustomAvatar from './CustomAvatar'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Others
import { formatDate } from '../helpers/helpers'

// @ Styles
const StyledCoverImg = styled('img')({
	objectFit    : 'contain',
	height       : '150px',
	overflow     : 'hidden',
	borderRadius : '4px'
})

// @ Main
const HistoryGameDetails = ({ data, cycleIndex, index }) => {
	const [ openDialog, setOpenDialog ] = useState(false)

	console.log(data)

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
					<CenterFocusWeakTwoToneIcon fontSize="small" />
				</CustomIconBtn>
			</CustomTooltip>

			<Dialog fullWidth maxWidth="sm" open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					<Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
						<Box display="flex" flexDirection="column" gap={0.5}>
							<Box fontSize="h6.fontSize">{data.games[index].title}</Box>
							<Box fontSize="0.75rem" color="grey.500">
								{`${data.games[index].subtype} • ${data.games[index].year}`}
							</Box>
						</Box>
						<CustomIconBtn onClick={handleCloseDialog} color="secondary" size="large">
							<CloseIcon />
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
					<Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
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

						<ExtLinkIconBtn url={`https://boardgamegeek.com/boardgame/${data.games[index].bggId}`} />
					</Box>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default HistoryGameDetails
