// @ Libraries
import React, { Fragment, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles';

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// @ Icons
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

// @ Components
import ActiveAddHistoryButton from './ActiveAddHistoryButton'
import GameDetailsButton from './GameDetailsButton'
import CustomTooltip from './CustomTooltip'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card          : {
		position : 'relative'
	},
	media         : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},
	overlayTop    : {
		position : 'absolute',
		top      : '8px',
		left     : '8px'
	},
	overlayBottom : {
		position : 'absolute',
		top      : '36px',
		left     : '8px'
	},
	title         : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	}
}))

// @ Main
const ListedGameCard = ({ data }) => {
	const cls = useStyles()

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
        <Card className={cls.card} elevation={1}>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
				alt={data.games[index].title}
				title={data.games[index].title}
			/>

			{data.isPack && (
				<Fragment>
					<Chip
						size="small"
						color="secondary"
						className={cls.overlayTop}
						label={`${data.games.length} pack`}
					/>

					{data.mode === 'sell' && (
						<Box className={cls.overlayBottom}>
							<CustomTooltip title="For sale">
								<MonetizationOnOutlinedIcon color="secondary" />
							</CustomTooltip>
						</Box>
					)}

					{data.mode === 'trade' && (
						<Box className={cls.overlayBottom}>
							<CustomTooltip title="For trade">
								<SwapHorizontalCircleOutlinedIcon color="secondary" />
							</CustomTooltip>
						</Box>
					)}
				</Fragment>
			)}

			{!data.isPack &&
			data.mode === 'sell' && (
				<Box className={cls.overlayTop}>
					<CustomTooltip title="For sale">
						<MonetizationOnOutlinedIcon color="secondary" />
					</CustomTooltip>
				</Box>
			)}

			{!data.isPack &&
			data.mode === 'trade' && (
				<Box className={cls.overlayTop}>
					<CustomTooltip title="For trade">
						<SwapHorizontalCircleOutlinedIcon color="secondary" />
					</CustomTooltip>
				</Box>
			)}

			{!data.isPack &&
			data.mode === 'want' && (
				<Box className={cls.overlayTop}>
					<CustomTooltip title="Want to buy">
						<AddCircleOutlineIcon color="secondary" />
					</CustomTooltip>
				</Box>
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
                                size="large">
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={cls.title}>
								{data.games[index].title} ({data.games[index].year})
							</Box>
							<IconButton
                                color="primary"
                                disabled={data.games.length === index + 1}
                                onClick={() => handleIndex('plus')}
                                size="large">
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<Box className={cls.title}>
							{data.games[index].title} ({data.games[index].year})
						</Box>
					)}
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-evenly" alignItems="center" width="100%">
					<ActiveAddHistoryButton gameId={data._id} isActive={data.isActive} display="reactivate" />

					{data.mode !== 'want' && (
						<Fragment>
							<ActiveAddHistoryButton
								games={data.games}
								isActive={data.isActive}
								price={data.totalPrice}
								gameId={data._id}
								mode={data.mode}
								display="add"
							/>

							<GameDetailsButton altId={data.altId} />
						</Fragment>
					)}

					<ActiveAddHistoryButton gameId={data._id} display="delete" />
				</Box>
			</CardActions>
		</Card>
    );
}

export default ListedGameCard
