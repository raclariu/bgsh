import React, { Fragment } from 'react'
import approx from 'approximate-number'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

// const defaultBox = {
// 	display        : 'flex',
// 	flexDirection  : 'column',
// 	alignItems     : 'center',
// 	justifyContent : 'center',
// 	fontWeight     : 'bold',
// 	textAlign      : 'center',
// 	borderRadius   : 4,
// 	boxShadow      : 2,
// 	height         : 70,
// 	width          : 110,
// 	fontSize       : 20,
// 	color          : '#fff'
// }

// const asd = {
// 	color        : '#fff',
// 	p            : 1,
// 	textAlign    : 'center',
// 	fontWeight   : 'fontWeightMedium',
// 	minWidth     : 45,
// 	boxShadow    : 2,
// 	borderRadius : 4
// }

const StatsBoxes = ({ complexity, stats, variant }) => {
	let defaultBox

	if (variant === 'mini') {
		defaultBox = {
			color        : '#fff',
			p            : 1,
			textAlign    : 'center',
			fontWeight   : 'fontWeightMedium',
			minWidth     : 45,
			boxShadow    : 2,
			borderRadius : 4
		}
	} else {
		defaultBox = {
			display        : 'flex',
			flexDirection  : 'column',
			alignItems     : 'center',
			justifyContent : 'center',
			fontWeight     : 'bold',
			textAlign      : 'center',
			borderRadius   : 4,
			boxShadow      : 2,
			height         : 70,
			width          : 110,
			fontSize       : 20,
			color          : '#fff'
		}
	}

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
		<Box display="flex" justifyContent="center" alignItems="center" width="100%">
			<Box bgcolor={handleRatingBgColor()} {...defaultBox}>
				{variant === 'mini' ? (
					<Fragment>{approx(stats.avgRating)}</Fragment>
				) : (
					<Fragment>
						{approx(stats.avgRating)}
						<Box fontSize={11} color="grey.200">
							{approx(stats.ratings)} ratings
						</Box>
					</Fragment>
				)}
			</Box>

			<Box ml={1} bgcolor={stats.rank <= 100 ? '#d4b215' : '#666e75'} {...defaultBox}>
				{variant === 'mini' ? (
					<Fragment>{stats.rank}</Fragment>
				) : (
					<Fragment>
						{stats.rank}
						<Box fontSize={11} color="grey.200">
							rank
						</Box>
					</Fragment>
				)}
			</Box>

			<Box ml={1} bgcolor={handleComplexityBgColor()} {...defaultBox}>
				{variant === 'mini' ? (
					<Fragment>{(Math.round(complexity.weight * 100) / 100).toFixed(2)}</Fragment>
				) : (
					<Fragment>
						{(Math.round(complexity.weight * 100) / 100).toFixed(2)}
						{complexity.weight === 'N/A' ? (
							<Box fontSize={11} color="grey.200">
								weight
							</Box>
						) : (
							<Box fontSize={11} color="grey.200">
								{approx(complexity.votes)} votes
							</Box>
						)}
					</Fragment>
				)}
			</Box>
		</Box>

		// <Fragment>
		// 	{/* {variant === 'mini' && (
		// 		<Fragment>
		// 			<Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={1}>
		// 				<Box
		// 					color="#fff"
		// 					p={1}
		// 					textAlign="center"
		// 					fontWeight="fontWeightMedium"
		// 					minWidth={45}
		// 					boxShadow={2}
		// 					borderRadius={4}
		// 					bgcolor={handleRatingBgColor()}
		// 				>
		// 					{variant === 'mini' ? (
		// 						<Fragment>{approx(stats.avgRating)}</Fragment>
		// 					) : (
		// 						<Fragment>
		// 							{approx(stats.avgRating)}
		// 							<Box fontSize={11} color="grey.200">
		// 								{approx(stats.ratings)} ratings
		// 							</Box>
		// 						</Fragment>
		// 					)}
		// 				</Box>

		// 				<Box
		// 					color="#fff"
		// 					p={1}
		// 					ml={1}
		// 					textAlign="center"
		// 					fontWeight="fontWeightMedium"
		// 					minWidth={45}
		// 					boxShadow={2}
		// 					borderRadius={4}
		// 					bgcolor={stats.rank <= 100 ? '#d4b215' : '#666e75'}
		// 				>
		// 					{variant === 'mini' ? (
		// 						<Fragment>{stats.rank}</Fragment>
		// 					) : (
		// 						<Fragment>
		// 							{stats.rank}
		// 							<Box fontSize={11} color="grey.200">
		// 								rank
		// 							</Box>
		// 						</Fragment>
		// 					)}
		// 				</Box>

		// 				<Box
		// 					color="#fff"
		// 					p={1}
		// 					textAlign="center"
		// 					fontWeight="fontWeightMedium"
		// 					minWidth={45}
		// 					ml={1}
		// 					boxShadow={2}
		// 					borderRadius={4}
		// 					bgcolor={handleComplexityBgColor()}
		// 				>
		// 					{variant === 'mini' ? (
		// 						<Fragment>{(Math.round(complexity.weight * 100) / 100).toFixed(2)}</Fragment>
		// 					) : (
		// 						<Fragment>
		// 							{(Math.round(complexity.weight * 100) / 100).toFixed(2)}
		// 							{complexity.weight === 'N/A' ? (
		// 								<Box fontSize={11} color="grey.200">
		// 									weight
		// 								</Box>
		// 							) : (
		// 								<Box fontSize={11} color="grey.200">
		// 									{approx(complexity.votes)} votes
		// 								</Box>
		// 							)}
		// 						</Fragment>
		// 					)}
		// 				</Box>
		// 			</Box>
		// 		</Fragment>
		// 	)}

		// 	{variant === 'full' && (
		// 		<Fragment>
		// 			<Grid item>
		// 				<Box bgcolor={handleRatingBgColor()} {...defaultBox}>
		// 					{approx(stats.avgRating)}
		// 					<Box fontSize={11} color="grey.200">
		// 						{approx(stats.ratings)} ratings
		// 					</Box>
		// 				</Box>
		// 			</Grid>
		// 			<Grid item>
		// 				<Box bgcolor={stats.rank <= 100 ? '#d4b215' : '#666e75'} {...defaultBox}>
		// 					{stats.rank}
		// 					<Box fontSize={11} color="grey.200">
		// 						rank
		// 					</Box>
		// 				</Box>
		// 			</Grid>
		// 			<Grid item>
		// 				<Box bgcolor={handleComplexityBgColor()} {...defaultBox}>
		// 					{variant === 'mini' ? (
		// 						<Fragment>{(Math.round(complexity.weight * 100) / 100).toFixed(2)}</Fragment>
		// 					) : (
		// 						<Fragment>
		// 							{(Math.round(complexity.weight * 100) / 100).toFixed(2)}
		// 							{complexity.weight === 'N/A' ? (
		// 								<Box fontSize={11} color="grey.200">
		// 									weight
		// 								</Box>
		// 							) : (
		// 								<Box fontSize={11} color="grey.200">
		// 									{approx(complexity.votes)} votes
		// 								</Box>
		// 							)}
		// 						</Fragment>
		// 					)}
		// 				</Box>
		// 			</Grid>
		// 		</Fragment>
		// 	)} */}
		// </Fragment>
	)
}

export default StatsBoxes
