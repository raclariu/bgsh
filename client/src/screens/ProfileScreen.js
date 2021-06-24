import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CollectionFetchBox from '../components/CollectionFetchBox'
import BggSearchGamesBox from '../components/BggSearchGamesBox'

const useStyles = makeStyles((theme) => ({
	root : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	}
}))

const ProfileScreen = () => {
	const cls = useStyles()

	return (
		<Fragment>
			<Grid container spacing={3}>
				<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
					<Box p={2} borderRadius={4} boxShadow={2}>
						<Typography variant="subtitle2" paragraph>
							Import your BoardGameGeek collection
						</Typography>
						<CollectionFetchBox />
					</Box>
				</Grid>
				<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
					<Box p={2} borderRadius={4} boxShadow={2}>
						<Typography variant="subtitle2" paragraph>
							Search BGG games
						</Typography>
						<BggSearchGamesBox />
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default ProfileScreen
