import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import CollectionFetchBox from '../components/collection/CollectionFetchBox'

const useStyles = makeStyles((theme) => ({
	root : {
		margin : theme.spacing(4, 0, 4, 0)
	}
}))

const ProfileScreen = () => {
	const cls = useStyles()

	return (
		<Fragment>
			<Box mt={4}>
				<Grid container spacing={3}>
					<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
						<Box p={2} bgcolor="warning.light" borderRadius={4} boxShadow={2}>
							<Typography variant="subtitle2" paragraph>
								Import your BoardGameGeek collection
							</Typography>
							<CollectionFetchBox />
							<Divider orientation="vertical" flexItem />
						</Box>
					</Grid>
					<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
						<Box p={2} bgcolor="warning.light" borderRadius={4} boxShadow={2}>
							<Typography variant="subtitle2" paragraph>
								Import your BoardGameGeek collection
							</Typography>
							<CollectionFetchBox />
							<Divider orientation="vertical" flexItem />
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Fragment>
	)
}

export default ProfileScreen
