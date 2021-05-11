import React from 'react'
import Grid from '@material-ui/core/Grid'

import CollectionFetchBox from '../components/collection/CollectionFetchBox'

const ProfileScreen = () => {
	return (
		<Grid container spacing={3} justify="center">
			<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
				<CollectionFetchBox />
			</Grid>
		</Grid>
	)
}

export default ProfileScreen
