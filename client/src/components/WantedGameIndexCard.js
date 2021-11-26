// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

// @ Components
import CustomAvatar from './CustomAvatar'
import SendMessage from '../components/SendMessage'
import CustomTooltip from '../components/CustomTooltip'

// @ Others
import { calculateTimeAgo } from '../helpers/helpers'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card  : {
		position : 'relative'
	},
	media : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},
	title : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	}
}))

const WantedGameIndexCard = ({ data }) => {
	const cls = useStyles()

	// const data = useSelector((state) => state.wantedGamesIndex.gamesData.find((obj) => obj._id === gameId))

	return (
		<Card className={cls.card} elevation={1}>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
				alt={data.title}
				title={data.title}
			/>

			<Divider />

			<CardContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					<Box className={cls.title}>{data.title}</Box>
				</Box>
			</CardContent>

			<Divider />

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					<Chip
						size="small"
						label={`${data.prefVersion.title} • ${data.prefVersion.year}`}
						variant="outlined"
					/>

					<Box mt={0.5}>
						<Chip size="small" label={data.prefShipping.join(', ')} variant="outlined" />
					</Box>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="center" alignItems="center">
						<CustomAvatar size="medium" user={data.wantedBy.username} />

						<Box fontSize={12} ml={1}>
							{calculateTimeAgo(data.createdAt)}
						</Box>
					</Box>

					<SendMessage recipientUsername={data.wantedBy.username} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default WantedGameIndexCard
