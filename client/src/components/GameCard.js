// @ Libraries
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Icons
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import SearchIcon from '@material-ui/icons/Search'

// @ Styles
const useStyles = makeStyles((theme) => ({
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

// @ Main
const GameCard = ({ data, saleListHandler, isChecked, isDisabled }) => {
	const cls = useStyles()

	return (
		<Card elevation={1}>
			<CardMedia
				className={cls.media}
				component="img"
				alt={data.title}
				image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
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
					<Box className={cls.title}>
						{data.title} ({data.year})
					</Box>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
					<CustomTooltip title="See on BGG">
						<Button
							color="primary"
							href={`https://boardgamegeek.com/boardgame/${data.bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</CustomTooltip>

					<CustomTooltip
						title={isChecked ? `Remove "${data.title}" from list` : `Add "${data.title}" to list`}
					>
						<Checkbox
							checked={isChecked}
							disabled={isDisabled}
							onChange={(e) => saleListHandler(e, data.bggId)}
							icon={<AddBoxOutlinedIcon />}
						/>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameCard
