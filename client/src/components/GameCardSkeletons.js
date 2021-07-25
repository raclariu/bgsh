import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
	box       : {
		display       : 'flex',
		flexDirection : 'column',
		alignItems    : 'center',
		height        : '300px',
		paddingBottom : theme.spacing(1)
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

const GameCardSkeletons = ({ num }) => {
	const cls = useStyles()

	const renderSkeletons = () => {
		let skeletonsArr = []
		for (let i = 0; i < num; i++) {
			skeletonsArr.push(
				<Grid key={i} item xl={4} lg={4} md={4} sm={6} xs={12}>
					<Box className={cls.box} boxShadow={2} borderRadius={4}>
						<Skeleton animation="wave" className={cls.skMedia} variant="rect" width={160} height={150} />

						<Divider animation="wave" className={cls.divider} />

						<Box minHeight="50px" m={1}>
							<Skeleton animation="wave" className={cls.skTitle} variant="text" width={200} />
						</Box>

						<Divider animation="wave" className={cls.divider} />

						<Skeleton animation="wave" className={cls.skButtons} variant="text" />
					</Box>
				</Grid>
			)
		}
		return skeletonsArr
	}

	return <Fragment>{renderSkeletons()}</Fragment>
}

export default GameCardSkeletons
