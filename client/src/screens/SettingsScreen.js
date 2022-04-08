// @ Modules
import React, { Fragment, useState } from 'react'

// @ Mui
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ChangePasswordForm from '../components/ChangePasswordForm'
import Helmet from '../components/Helmet'
import ChangeAvatar from '../components/ChangeAvatar'

// @ Main
const SettingsScreen = () => {
	return (
		<Fragment>
			<Helmet title="Settings" />
			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={3}>
				<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
					<ChangeAvatar />
					<Box fontWeight="fontWeightMedium">Change avatar</Box>
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
