// @ Libraries
import React, { Fragment, useState } from 'react'

// @ Mui
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// @ Components
import CustomDivider from '../components/CustomDivider'
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
			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={3}>
				<Box mt={3}>
					<ChangeAvatar />
				</Box>
				<CustomDivider flexItem />
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
		</Fragment>
	)
}

export default SettingsScreen
