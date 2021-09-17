// @ Libraries
import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'

// @ Styles
const useStyles = makeStyles((theme) => ({
	small  : {
		width           : theme.spacing(3),
		height          : theme.spacing(3),
		backgroundColor : theme.palette.primary.main
	},
	medium : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	},
	large  : {
		width           : theme.spacing(5),
		height          : theme.spacing(5),
		backgroundColor : theme.palette.primary.main
	}
}))

// @ Main
const CustomAvatar = ({ size, showUser }) => {
	const cls = useStyles()

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	return (
		<Box display="flex" flexDirection="row" alignItems="center">
			<Avatar
				className={size === 'small' ? cls.small : size === 'medium' ? cls.medium : cls.large}
				color="primary"
			>
				<Box fontSize={size === 'small' ? 10 : size === 'medium' ? 12 : 14}>
					{userInfo.username.substring(0, 2).toUpperCase()}
				</Box>
			</Avatar>
			{showUser && (
				<Box fontWeight="fontWeightMedium" ml={1}>
					{userInfo.username}
				</Box>
			)}
		</Box>
	)
}

export default CustomAvatar
