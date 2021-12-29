// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'

// @ Components
import ChangePasswordForm from '../components/ChangePasswordForm'
import CollectionFetchBox from '../components/CollectionFetchBox'
import BggSearchGamesBox from '../components/BggSearchGamesBox'

// @ Main
const SettingsScreen = () => {
	const [ tab, setTab ] = useState('profile')

	const handleTabChange = (event, newTab) => {
		setTab(newTab)
	}

	return (
		<Fragment>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				bgcolor="background.paper"
				boxShadow={2}
				borderRadius="4px"
				mt={4}
			>
				<Tabs value={tab} centered indicatorColor="primary" textColor="primary" onChange={handleTabChange}>
					<Tab value="profile" label="Profile" />
					<Tab value="change-password" label="Change password" />
				</Tabs>
			</Box>

			{tab === 'change-password' && (
				<Grid container justifyContent="center" alignItems="center">
					<Grid item xs={12} sm={8} md={7}>
						<ChangePasswordForm />
					</Grid>
				</Grid>
			)}

			{tab === 'profile' && (
				<Grid spacing={10} container justifyContent="center" alignItems="center">
					<Grid item xs={12} sm={8} md={7}>
						<CollectionFetchBox />
					</Grid>

					<Grid item xs={12} sm={8} md={7}>
						<BggSearchGamesBox />
					</Grid>

					<Divider style={{ width: '100%' }} />
				</Grid>
			)}
		</Fragment>
	)
}

export default SettingsScreen
