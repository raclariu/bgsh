// @ Modules
import React, { Fragment } from 'react'

// @ Mui
import Box from '@mui/material/Box'

// @ Icons
import InterestsTwoToneIcon from '@mui/icons-material/InterestsTwoTone'
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone'

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

				<Box
					sx={{
						width : {
							xs : '100%',
							sm : '85%',
							md : '50%'
						}
					}}
				>
					<Box display="flex" alignItems="center" gap={1} mb={3}>
						<InterestsTwoToneIcon color="primary" />
						<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium" alignSelf="flex-start">
							Socials
						</Box>
					</Box>
					<SocialsForm />
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
					<Box display="flex" alignItems="center" gap={1} mb={3}>
						<LockTwoToneIcon color="primary" />
						<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium" alignSelf="flex-start">
							Change password
						</Box>
					</Box>

					<ChangePasswordForm />
				</Box>
			</Box>
		</Fragment>
	)
}

export default SettingsScreen
