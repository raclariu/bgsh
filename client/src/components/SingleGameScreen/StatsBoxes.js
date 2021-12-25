// @ Libraries
import React, { Fragment } from 'react'
import approx from 'approximate-number'

// @ Mui
import Box from '@mui/material/Box'

// @ Helpers
const defaultBigBox = {
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
	fontSize       : 20,
	color          : '#fff'
}

const defaultMiniBox = {
	color        : '#fff',
	p            : 1,
	textAlign    : 'center',
	fontWeight   : 'fontWeightMedium',
	minWidth     : 45,
	boxShadow    : 2,
	borderRadius : 4
}

const RatingBox = ({ variant, stats }) => {
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

	return (
		<Fragment>
			{variant === 'mini' ? (
				<Box bgcolor={handleRatingBgColor()} {...defaultMiniBox}>
					{approx(stats.avgRating)}
				</Box>
			) : (
				<Box bgcolor={handleRatingBgColor()} {...defaultBigBox}>
					{approx(stats.avgRating)}
					<Box fontSize={11} color="grey.200">
						{approx(stats.ratings)} ratings
					</Box>
				</Box>
			)}
		</Fragment>
	)
}

const RankBox = ({ variant, stats }) => {
	const handleRankBgColor = () => {
		if (stats.rank && stats.rank <= 100) {
			return '#cfb000'
		} else {
			return '#666e75'
		}
	}

	return (
		<Fragment>
			{variant === 'mini' && (
				<Box bgcolor={handleRankBgColor()} {...defaultMiniBox}>
					{!stats.rank ? <Box color="grey.200">N/A</Box> : <Box color="grey.200">{stats.rank}</Box>}
				</Box>
			)}

			{variant === 'full' && (
				<Box bgcolor={handleRankBgColor()} {...defaultBigBox}>
					{!stats.rank ? (
						<Fragment>
							<Box>N/A</Box>
							<Box fontSize={11} color="grey.200">
								rank
							</Box>
						</Fragment>
					) : (
						<Fragment>
							{stats.rank}
							<Box fontSize={11} color="grey.200">
								rank
							</Box>
						</Fragment>
					)}
				</Box>
			)}
		</Fragment>
	)
}

const ComplexityBox = ({ variant, complexity }) => {
	const handleComplexityBgColor = () => {
		if (complexity.votes > 10) {
			if (complexity.weight > 3.0) {
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
			{variant === 'mini' ? (
				<Box bgcolor={handleComplexityBgColor()} {...defaultMiniBox}>
					{!complexity.weight ? (
						<Box color="grey.200">N/A</Box>
					) : (
						<Box color="grey.200">{(Math.round(complexity.weight * 100) / 100).toFixed(2)}</Box>
					)}
				</Box>
			) : (
				<Box bgcolor={handleComplexityBgColor()} {...defaultBigBox}>
					{!complexity.weight ? (
						<Fragment>
							<Box>N/A</Box>
							<Box fontSize={11} color="grey.200">
								weight
							</Box>
						</Fragment>
					) : (
						<Fragment>
							{(Math.round(complexity.weight * 100) / 100).toFixed(2)}
							<Box fontSize={11} color="grey.200">
								{approx(complexity.votes)} votes
							</Box>
						</Fragment>
					)}
				</Box>
			)}
		</Fragment>
	)
}

// @ Main
const StatsBoxes = ({ complexity, stats, variant, type }) => {
	return (
		<Fragment>
			{type === 'rating' && <RatingBox variant={variant} stats={stats} />}

			{type === 'rank' && <RankBox variant={variant} stats={stats} />}

			{type === 'complexity' && <ComplexityBox variant={variant} complexity={complexity} />}
		</Fragment>
	)
}

export default StatsBoxes
