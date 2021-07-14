import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import FaceTwoToneIcon from '@material-ui/icons/FaceTwoTone'
import PublicTwoToneIcon from '@material-ui/icons/PublicTwoTone'

const useStyles = makeStyles((theme) => ({
	root : {
		display        : 'flex',
		flexDirection  : 'column',
		alignItems     : 'center',
		justifyContent : 'center',
		width          : '100%'
	},
	mr   : {
		marginRight : theme.spacing(0.5)
	}
}))

const DesLangText = ({ data }) => {
	const cls = useStyles()

	return (
		<Box className={cls.root}>
			<Typography variant="caption">
				<Box display="flex">
					<FaceTwoToneIcon className={cls.mr} fontSize="small" color="primary" />
					<Box>{data.designers.length > 0 ? data.designers.join(', ') : 'N/A'}</Box>
				</Box>

				<Box display="flex">
					<PublicTwoToneIcon className={cls.mr} fontSize="small" color="primary" />
					<Box>{data.languageDependence}</Box>
				</Box>
			</Typography>
		</Box>
	)
}

export default DesLangText
