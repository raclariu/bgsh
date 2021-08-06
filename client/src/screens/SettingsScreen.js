import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Message from '../components/Message'

import ChangePasswordForm from '../components/ChangePasswordForm'

const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	}
}))

const SettingsScreen = () => {
	const cls = useStyles()

	const changePass = useSelector((state) => state.changePassword)
	const { success } = changePass

	return (
		<Fragment>
			{success && <Message severity="success">Password changed successfully.</Message>}

			<Grid container className={cls.gridContainer} direction="column" justify="center" alignItems="center">
				<Grid item md={4} sm={7} xs={11}>
					<ChangePasswordForm />
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default SettingsScreen
