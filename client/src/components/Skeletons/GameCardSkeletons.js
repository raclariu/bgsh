import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
	box     : {
		display         : 'flex',
		flexDirection   : 'column',
		alignItems      : 'center',
		backgroundColor : theme.palette.background.paper
	},
	skMedia : {
		margin : theme.spacing(1, 0, 1, 0)
	},
	divider : {
		width : '100%'
	}
}))

const GameCardSkeletons = ({ num, height }) => {
	const cls = useStyles()

	const renderSkeletons = () => {
		let skeletonsArr = []
		for (let i = 0; i < num; i++) {
			skeletonsArr.push(
				<Grid key={i} item xl={4} lg={4} md={4} sm={6} xs={12}>
					<Box className={cls.box} boxShadow={2} borderRadius={4}>
						<Skeleton animation="wave" className={cls.skMedia} variant="rect" width={200} height={180} />

						<Divider animation="wave" className={cls.divider} />

						<Box display="flex" justifyContent="center" alignItems="center" height="80px">
							<Skeleton animation="wave" variant="text" width={220} height={25} />
						</Box>

						<Divider animation="wave" className={cls.divider} />

						<Box height={60} width="90%" display="flex" justifyContent="center" alignItems="center">
							<Skeleton animation="wave" variant="text" width="100%" height={25} />
						</Box>
					</Box>
				</Grid>
			)
		}
		return skeletonsArr
	}

	return <Fragment>{renderSkeletons()}</Fragment>
}

export default GameCardSkeletons
