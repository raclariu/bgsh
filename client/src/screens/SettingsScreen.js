// @ Modules
import React, { Fragment } from 'react'
import { useInView } from 'react-intersection-observer'

// @ Mui
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// @ Icons
import InterestsTwoToneIcon from '@mui/icons-material/InterestsTwoTone'
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone'
import MarkEmailReadTwoToneIcon from '@mui/icons-material/MarkEmailReadTwoTone'

// @ Components
import CustomIconBtn from '../components/CustomIconBtn'
import Loader from '../components/Loader'
import CustomDivider from '../components/CustomDivider'
import ChangePasswordForm from '../components/ChangePasswordForm'
import Helmet from '../components/Helmet'
import ChangeAvatar from '../components/ChangeAvatar'
import SocialsForm from '../components/SocialsForm'

// @ Others
import { useGetEmailNotificationStatusQuery, useUpdateEmailNotificationStatusMutation } from '../hooks/hooks'

// Email notif checkbox
const EmailNotificationsCheckbox = ({ emailCheckboxInView }) => {
	const { isFetching, data, isSuccess } = useGetEmailNotificationStatusQuery({ emailCheckboxInView })

	const updateEmailCheckbox = useUpdateEmailNotificationStatusMutation()
	const handleCheckbox = () => {
		updateEmailCheckbox.mutate()
	}

	return (
		<Fragment>
			{isFetching && (
				<CustomIconBtn disabled disableRipple size="large">
					<Loader size={20} />
				</CustomIconBtn>
			)}

			{isSuccess && (
				<FormControlLabel
					label="Send me an email when I receive a new message"
					// disabled={isLoading}
					control={
						<Checkbox
							sx={{ height: 48, width: 48 }}
							checked={data.emailNotifications}
							onChange={handleCheckbox}
						/>
					}
				/>
			)}
		</Fragment>
	)
}

// @ Main
const SettingsScreen = () => {
	const { ref: emailCheckboxRef, inView: emailCheckboxInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

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
					<Box ref={emailCheckboxRef} display="flex" alignItems="center" gap={1} mb={3}>
						<MarkEmailReadTwoToneIcon color="primary" />
						<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium" alignSelf="flex-start">
							Email notifications
						</Box>
					</Box>

					<EmailNotificationsCheckbox emailCheckboxInView={emailCheckboxInView} />
				</Box>
			</Box>
		</Fragment>
	)
}

export default SettingsScreen
