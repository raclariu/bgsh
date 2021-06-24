import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'

const useStyles = makeStyles((theme) => ({
	avatar : {
		backgroundColor : '#3f51b5'
	},
	header : {
		backgroundColor : 'lightgrey'
	},
	media  : {
		objectFit      : 'cover',
		height         : '150px',
		objectPosition : 'center 10%'
		//padding   : theme.spacing(1)
		//backgroundColor : 'lightgrey'
	}
}))

const SingleSellGameCard = ({ data }) => {
	const cls = useStyles()

	return (
		<Card>
			{console.count('render')}
			<CardHeader
				title={data.games[0].title}
				titleTypographyProps={{
					variant : 'subtitle2'
				}}
				subheader={`added on ${data.createdAt.substring(0, 10)} by ${data.seller.username} `}
				subheaderTypographyProps={{
					variant : 'caption'
				}}
				action={
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				}
			/>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.games[0].thumbnail ? data.games[0].thumbnail : '/images/collCardPlaceholder.jpg'}
				alt={data.games[0].title}
				title={data.games[0].title}
			/>
			<CardContent>
				<Typography component="div">
					{/* <Box textAlign="center" fontWeight="fontWeightMedium">
						{data.games[0].title}
					</Box> */}

					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
						<Box display="flex" justifyContent="center" alignItems="center" fontSize={12}>
							{data.games[0].condition}
						</Box>
						<Box display="flex" justifyContent="center" alignItems="center" fontSize={12}>
							{data.games[0].version.title}
						</Box>
					</Box>
				</Typography>
			</CardContent>
			<Divider />
			<CardActions>
				<Box display="flex" justifyContent="center" width="100%">
					<Box display="flex" justifyContent="space-between" alignItems="center" width="90%">
						<Button
							component={RouterLink}
							color="primary"
							size="small"
							to={{ pathname: `/games/${data.altId}` }}
						>
							See More
						</Button>
						<Box fontSize={15} fontWeight="bold" color="secondary.main">
							{data.games[0].price} RON
						</Box>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export default SingleSellGameCard
