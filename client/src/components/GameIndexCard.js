// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import StatsBoxes from './SingleGameScreen/StatsBoxes'
import GameDetailsButton from './GameDetailsButton'
import CustomAvatar from './CustomAvatar'

// @ Other
import { calculateTimeAgo } from '../helpers/helpers'

// @ Styles
const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

// @ Main
const GameIndexCard = ({ data }) => {
	const [ index, setIndex ] = useState(0)

	const handleIndex = (type) => {
		if (type === 'minus') {
			if (index > 0) {
				setIndex(index - 1)
			}
		}
		if (type === 'plus') {
			if (data.games.length > index + 1) {
				setIndex(index + 1)
			}
		}
	}

	return (
		<Card sx={{ position: 'relative' }} elevation={1}>
			<Box py={1}>
				<CardMedia
					sx={{
						objectFit : 'contain',
						height    : '180px'
					}}
					component="img"
					image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
					alt={data.games[index].title}
					title={data.games[index].title}
				/>

				<Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={1}>
					<Box>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
							type="rating"
						/>
					</Box>
					<Box ml={1}>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
							type="rank"
						/>
					</Box>
					<Box ml={1}>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
							type="complexity"
						/>
					</Box>
				</Box>
			</Box>

			{data.isPack && (
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

			<Divider />

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
							<IconButton
								color="primary"
								disabled={index === 0}
								onClick={() => handleIndex('minus')}
								size="large"
							>
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<StyledTitleBox>{data.games[index].title}</StyledTitleBox>
							<IconButton
								color="primary"
								disabled={data.games.length === index + 1}
								onClick={() => handleIndex('plus')}
								size="large"
							>
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<StyledTitleBox sx={{ width: '100%' }}>{data.games[index].title}</StyledTitleBox>
					)}
				</Box>
			</CardContent>
			<Divider />

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					{data.mode !== 'want' ? (
						<Fragment>
							<Chip
								size="small"
								color="primary"
								variant="outlined"
								label={`${data.games[index].type} • ${data.games[index].condition}`}
							/>

							<Box mt={0.5}>
								<Chip
									size="small"
									color="primary"
									variant="outlined"
									label={`${data.games[index].version.title} • ${data.games[index].version.year}`}
								/>
							</Box>
						</Fragment>
					) : (
						<Fragment>
							<Chip
								size="small"
								variant="outlined"
								label={`${data.games[index].prefVersion.title} • ${data.games[index].prefVersion.year}`}
							/>

							<Box mt={0.5}>
								<Chip size="small" variant="outlined" label={`${data.shipping.shipPreffered}`} />
							</Box>
						</Fragment>
					)}

					{data.mode === 'sell' && (
						<Box fontWeight="fontWeightMedium" mt={0.5}>
							<Chip color="primary" label={`${data.totalPrice} RON`} />
						</Box>
					)}
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="center" alignItems="center">
						<CustomAvatar size="medium" user={data.addedBy.username} />

						<Box fontSize={12} ml={1}>
							{calculateTimeAgo(data.createdAt)}
						</Box>
					</Box>

					{data.mode !== 'want' && <GameDetailsButton altId={data.altId} />}
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameIndexCard
