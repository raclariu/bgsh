import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles((theme) => ({
	paper                      : {
		padding : theme.spacing(1)
	},
	skeletonImagePlaceholder   : {
		margin : theme.spacing(2, 0, 2, 0),
		width  : '170px',
		height : '130px'
	},
	skeletonTextPlaceholder    : {
		marginTop    : theme.spacing(2),
		marginBottom : theme.spacing(2),
		width        : '185px',
		height       : '25px'
	},
	skeletonButtonsPlaceholder : {
		width  : '90px',
		height : '60px'
	}
}))

const CollectionGameSkeleton = () => {
	const classes = useStyles()

	return (
		<Paper variant="outlined" className={classes.paper}>
			<Grid container direction="column" justify="center" align="center">
				<Grid item>
					<Skeleton className={classes.skeletonImagePlaceholder} variant="rect" />
				</Grid>
				<Grid item>
					<Skeleton className={classes.skeletonTextPlaceholder} variant="text" />
				</Grid>
			</Grid>
			<Grid container spacing={2} direction="row" justify="center" alignItems="center">
				<Grid item>
					<Skeleton className={classes.skeletonButtonsPlaceholder} variant="text" />
				</Grid>
				<Grid item>
					<Skeleton className={classes.skeletonButtonsPlaceholder} variant="text" />
				</Grid>
			</Grid>
		</Paper>
	)
}

export default CollectionGameSkeleton
