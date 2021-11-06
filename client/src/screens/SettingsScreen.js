// @ Libraries
import React, { Fragment, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Divider from '@material-ui/core/Divider'

// @ Components
import ChangePasswordForm from '../components/ChangePasswordForm'
import CollectionFetchBox from '../components/CollectionFetchBox'
import BggSearchGamesBox from '../components/BggSearchGamesBox'
import UserSocialsForm from '../components/UserSocialsForm'

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
				borderRadius={4}
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

					<Grid item xs={12} sm={8} md={7}>
						<UserSocialsForm />
					</Grid>
				</Grid>
			)}
		</Fragment>
	)
}

export default SettingsScreen
