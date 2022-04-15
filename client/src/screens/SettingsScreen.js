// @ Modules
import React, { Fragment } from 'react'

// @ Mui
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ChangePasswordForm from '../components/ChangePasswordForm'
import Helmet from '../components/Helmet'
import ChangeAvatar from '../components/ChangeAvatar'
import SocialsForm from '../components/SocialsForm'

// @ Main
const SettingsScreen = () => {
	return (
		<Fragment>
			<Helmet title="Settings" />
			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={3}>
				<ChangeAvatar />

				<CustomDivider flexItem />
				<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
					Socials
				</Box>
				<SocialsForm />

				<CustomDivider flexItem />
				<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
					Change your password
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
					<ChangePasswordForm />
				</Box>
			</Box>
		</Fragment>
	)
}

export default SettingsScreen
