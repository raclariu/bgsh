// @ Libraries
import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Styles
const useStyles = makeStyles((theme) => ({
	media : {
		//margin    : theme.spacing(1, 0, 1, 0),
		//padding   : theme.spacing(0, 1, 0, 1),
		objectFit      : 'fill',
		height         : '180px',
		objectPosition : 'center 10%'
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
const KsCard = ({ data }) => {
	const cls = useStyles()

	// const ks = useSelector((state) => state.kickstartersList.ksList.find((obj) => obj.ksId === ksId))

	return (
		<Card elevation={1}>
			<CardMedia
				className={cls.media}
				component="img"
				alt={data.title}
				image={data.image ? data.image : '/images/gameImgPlaceholder.jpg'}
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

			<CardActions>
				<Box display="flex" justifyContent="flex-end" width="100%">
					<CustomTooltip title="See on Kickstarter">
						<Button color="primary" href={`${data.url}`} target="_blank" rel="noopener">
							Page
						</Button>
					</CustomTooltip>

					<CustomTooltip title="Rewards page">
						<Button color="primary" href={`${data.url}/rewards`} target="_blank" rel="noopener">
							Rewards
						</Button>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

export default KsCard
