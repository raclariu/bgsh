// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

// @ Icons
import VpnKeyIcon from '@material-ui/icons/VpnKey'

// @ Components
import Message from '../components/Message'
import ChangePasswordForm from '../components/ChangePasswordForm'

// @ Styles
const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	tabTitle      : {
		textTransform : 'none'
	}
}))

// @ Main
const SettingsScreen = () => {
	const cls = useStyles()

	const [ tab, setTab ] = useState('change-password')

	const changePass = useSelector((state) => state.changePassword)
	const { success } = changePass

	const handleTabChange = (event, newTab) => {
		setTab(newTab)
	}

	return (
		<Fragment>
			{success && <Message severity="success">Password changed successfully.</Message>}

			<Grid container className={cls.gridContainer} direction="column" justify="center" alignItems="center">
				<Grid item>
					<Tabs value={tab} centered indicatorColor="primary" textColor="primary" onChange={handleTabChange}>
						<Tab
							value="change-password"
							label={
								<Box display="flex" alignItems="center">
									<VpnKeyIcon />
									<Box className={cls.tabTitle} ml={1}>
										Change password
									</Box>
								</Box>
							}
						/>
						<Tab value="test" label="Test" />
					</Tabs>
				</Grid>
				<Grid item md={5} sm={7} xs={11}>
					{tab === 'change-password' && <ChangePasswordForm />}
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default SettingsScreen
