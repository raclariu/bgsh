// @ Libraries
import React, { Fragment, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles';

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

// @ Styles
const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	input         : {
		minHeight : '90px'
	}
}))

// @ Main
const SettingsScreen = () => {
	const cls = useStyles()

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
				<Grid className={cls.gridContainer} container justifyContent="center" alignItems="center">
					<Grid item xs={12} sm={8} md={7}>
						<ChangePasswordForm />
					</Grid>
				</Grid>
			)}

			{tab === 'profile' && (
				<Grid className={cls.gridContainer} spacing={10} container justifyContent="center" alignItems="center">
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
    );
}

export default SettingsScreen
