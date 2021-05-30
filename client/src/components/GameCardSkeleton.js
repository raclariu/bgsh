import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Skeleton from '@material-ui/lab/Skeleton'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
	paper     : {
		display       : 'flex',
		flexDirection : 'column',
		alignItems    : 'center',
		height        : '300px',
		paddingBottom : '8px'
	},
	skMedia   : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	divider   : {
		width : '100%'
	},
	skTitle   : {
		margin : theme.spacing(2, 0, 1, 0)
	},
	skButtons : {
		width        : '95%',
		marginTop    : 'auto',
		marginBottom : theme.spacing(1),
		borderRadius : '4px'
	}
}))

const CollectionGameSkeleton = () => {
	const cls = useStyles()

	return (
		<Paper className={cls.paper} elevation={2}>
			<Skeleton animation="wave" className={cls.skMedia} variant="rect" width={160} height={150} />

			<Divider animation="wave" className={cls.divider} />

			<Skeleton animation="wave" className={cls.skTitle} variant="text" width={200} />

			<Skeleton animation="wave" className={cls.skButtons} variant="rect" height={15} />
		</Paper>
	)
}

export default CollectionGameSkeleton
