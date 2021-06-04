import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import Grow from '@material-ui/core/Grow'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const useStyles = makeStyles((theme) => ({
	// root        : {
	// 	height : '300px'
	// },
	// media       : {
	// 	margin    : theme.spacing(2, 0, 2, 0),
	// 	objectFit : 'contain',
	// 	height    : '150px'
	// },
	// cardContent : {
	// 	padding : '0px'
	// },
	// title       : {
	// 	margin     : theme.spacing(2, 0, 1, 0),
	// 	padding    : theme.spacing(0, 2, 0, 2),
	// 	minHeight  : '40px',
	// 	fontWeight : '500'
	// }

	avatar : {
		backgroundColor : '#3f51b5'
	},
	media  : {
		objectFit      : 'cover',
		height         : '150px',
		objectPosition : 'center 0%'
	}
}))

const SingleSellGameCard = ({ data }) => {
	const cls = useStyles()
	console.log(data)
	return (
		<Card>
			<CardHeader
				titleTypographyProps={{
					variant : 'button',
					color   : 'secondary'
				}}
				subheaderTypographyProps={{
					variant : 'caption'
				}}
				avatar={
					<Avatar variant="rounded" className={cls.avatar}>
						{data.seller.username.substring(0, 2).toUpperCase()}
					</Avatar>
					//<img src={data.games[0].thumbnail} alt={data.games[0].title} />
				}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title={data.games[0].title}
				subheader={`Sold by ${data.seller.username}`}
			/>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.games[0].thumbnail ? data.games[0].thumbnail : '/images/collCardPlaceholder.jpg'}
				alt={data.games[0].title}
				title={data.games[0].title}
			/>
			<CardContent>
				<p>
					{data.games[0].title} {data.games[0].year}
				</p>
				<p>Type:{data.games[0].type}</p>
				<p>Price:{data.games[0].price} RON</p>
				<p>
					Version:{data.games[0].version.title} {data.games[0].version.year}
				</p>
				<p>Condition:{data.games[0].condition}</p>
			</CardContent>
		</Card>
	)
}

export default SingleSellGameCard
