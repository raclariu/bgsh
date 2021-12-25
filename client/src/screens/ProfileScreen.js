// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// @ Components
import CollectionFetchBox from '../components/CollectionFetchBox'
import BggSearchGamesBox from '../components/BggSearchGamesBox'
import SendMessage from '../components/SendMessage'
import HelmetComponent from '../components/HelmetComponent'

const PREFIX = 'ProfileScreen'

const classes = {
	root : `${PREFIX}-root`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.root}`]: {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	}
}))

// @ Main
const ProfileScreen = () => {
	return (
		<Root>
			<HelmetComponent title="Profile" />
			<Grid container spacing={3}>
				<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
					<Box p={2} borderRadius="4px" boxShadow={2}>
						<Typography variant="subtitle2" paragraph>
							Import your BoardGameGeek collection
						</Typography>
						<CollectionFetchBox />
					</Box>
				</Grid>
				<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
					<Box p={2} borderRadius="4px" boxShadow={2}>
						<Typography variant="subtitle2" paragraph>
							Search BGG games
						</Typography>
						<BggSearchGamesBox />
					</Box>
				</Grid>

				<SendMessage />
			</Grid>
		</Root>
	)
}

export default ProfileScreen
