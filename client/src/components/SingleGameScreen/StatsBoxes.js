import React, { Fragment } from 'react'
import approx from 'approximate-number'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const defaultBox = {
	display        : 'flex',
	flexDirection  : 'column',
	alignItems     : 'center',
	justifyContent : 'center',
	fontWeight     : 'bold',
	textAlign      : 'center',
	borderRadius   : 4,
	boxShadow      : 2,
	height         : 60,
	width          : 100,
	fontSize       : 18,
	color          : '#fff'
}

const StatsBoxes = ({ complexity, stats }) => {
	const handleRatingBgColor = () => {
		const { ratings, avgRating } = stats
		if (ratings > 30) {
			if (avgRating >= 9) {
				return '#186b40'
			} else if (avgRating >= 8) {
				return '#1d804c'
			} else if (avgRating >= 7) {
				return '#1978b3'
			} else if (avgRating >= 5) {
				return '#5369a2'
			} else if (avgRating >= 4) {
				return '#d71925'
			} else {
				return '#666e75'
			}
		} else {
			return '#666e75'
		}
	}

	const handleComplexityBgColor = () => {
		if (complexity.votes > 10) {
			if (complexity.weight > 3.01) {
				return '#f06524'
			} else if (complexity.weight > 0) {
				return '#3ec781'
			}
		} else {
			return '#666e75'
		}
	}

	return (
		<Fragment>
			<Grid item>
				<Box bgcolor={handleRatingBgColor()} {...defaultBox}>
					{stats.avgRating}
					<Box fontSize={11} color="grey.200">
						{approx(stats.ratings)} ratings
					</Box>
				</Box>
			</Grid>
			<Grid item>
				<Box bgcolor={stats.rank <= 100 ? '#D9C836' : '#666e75'} {...defaultBox}>
					{stats.rank}
					<Box fontSize={11} color="grey.200">
						rank
					</Box>
				</Box>
			</Grid>
			<Grid item>
				<Box bgcolor={handleComplexityBgColor()} {...defaultBox}>
					{complexity.weight}
					{complexity.weight === 'N/A' ? (
						<Box fontSize={11} color="grey.200">
							weight
						</Box>
					) : (
						<Box fontSize={11} color="grey.200">
							{approx(complexity.votes)} votes
						</Box>
					)}
				</Box>
			</Grid>
		</Fragment>
	)
}

export default StatsBoxes
