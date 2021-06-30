import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import { formatDistance, parseISO } from 'date-fns'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const useStyles = makeStyles((theme) => ({
	root    : {
		position : 'relative'
	},
	media   : {
		objectFit      : 'cover',
		height         : '175px',
		objectPosition : 'center 10%',
		width          : '75%'
	},
	overlay : {
		position        : 'absolute',
		top             : '2.5%',
		right           : '2.5%',
		color           : 'black',
		backgroundColor : 'white',
		width           : '20%',
		textAlign       : 'center'
	},
	content : {
		padding : 0
	},
	avatar  : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

const SingleSellGameCard = ({ data }) => {
	const cls = useStyles()

	return (
		<Card className={cls.root}>
			<Box bgcolor="grey.900">
				<CardMedia
					className={cls.media}
					component="img"
					image={data.games[0].thumbnail ? data.games[0].thumbnail : '/images/collCardPlaceholder.jpg'}
					alt={data.games[0].title}
					title={data.games[0].title}
				/>
			</Box>
			<Box p={1} className={cls.overlay} boxShadow={2} borderRadius={4}>
				{data.games[0].stats.avgRating}
			</Box>
			<CardContent className={cls.content}>
				<Typography component="div">
					<Box
						textAlign="center"
						display="flex"
						justifyContent="center"
						alignItems="center"
						fontWeight="fontWeightMedium"
						fontSize={15}
						minHeight={50}
						m={1}
					>
						{data.games[0].title}
					</Box>

					<Divider />

					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={1}>
						<Box display="flex" justifyContent="center" alignItems="center" fontSize={12}>
							<ArrowRightIcon />
							<Box>{data.games[0].type}</Box>
						</Box>

						<Box display="flex" justifyContent="center" alignItems="center" fontSize={12}>
							<ArrowRightIcon />
							<Box>{data.games[0].condition}</Box>
						</Box>

						<Box display="flex" justifyContent="center" alignItems="center" fontSize={12}>
							<ArrowRightIcon />
							<Box>
								{data.games[0].version.title} ({data.games[0].version.year})
							</Box>
						</Box>
						<Box display="flex" justifyContent="center" alignItems="center" fontSize={12}>
							<ArrowRightIcon />
							<Box>{data.totalPrice}</Box>
						</Box>
					</Box>
				</Typography>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="flex-start" alignItems="center">
						<Avatar className={cls.avatar} color="primary">
							<Box fontSize={12}>JO</Box>
						</Avatar>
						<Typography component="div">
							<Box fontSize={12} ml={1}>
								{formatDistance(parseISO(data.createdAt), new Date(), { addSuffix: true })}
							</Box>
						</Typography>
					</Box>

					<Box display="flex" justifyContent="flex-end" alignItems="center">
						<IconButton component={RouterLink} to={{ pathname: `/games/${data.altId}` }} color="primary">
							<CenterFocusWeakTwoToneIcon fontSize="small" />
						</IconButton>

						<IconButton color="secondary">
							<BookmarkTwoToneIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export default SingleSellGameCard
