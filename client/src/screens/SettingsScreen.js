// @ Libraries
import React, { Fragment, useState } from 'react'

// @ Mui
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'

// @ Components
import ChangePasswordForm from '../components/ChangePasswordForm'
import CollectionFetchBox from '../components/CollectionFetchBox'
import BggSearchGamesBox from '../components/BggSearchGamesBox'
import ChangeAvatar from '../components/ChangeAvatar'

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
				<Box display="flex" justifyContent="center" width="100%" mt={2}>
					<Box
						sx={{
							width : {
								xs : '100%',
								sm : '85%',
								md : '50%'
							}
						}}
					>
						<ChangePasswordForm />
					</Box>
				</Box>
			)}

			{tab === 'profile' && (
				<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={5}>
					<Box mt={2}>
						<ChangeAvatar />
					</Box>
					<Divider flexItem />
					<Box
						sx={{
							width : {
								xs : '100%',
								sm : '85%',
								md : '50%'
							}
						}}
					>
						<CollectionFetchBox />
					</Box>
					<Box
						sx={{
							width : {
								xs : '100%',
								sm : '85%',
								md : '50%'
							}
						}}
					>
						<BggSearchGamesBox />
					</Box>
					<Divider flexItem />
				</Box>
			)}
		</Fragment>
	)
}

export default SettingsScreen
