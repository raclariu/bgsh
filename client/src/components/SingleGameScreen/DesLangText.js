import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import FaceTwoToneIcon from '@material-ui/icons/FaceTwoTone'
import PublicTwoToneIcon from '@material-ui/icons/PublicTwoTone'

const useStyles = makeStyles((theme) => ({
	mr : {
		marginRight : theme.spacing(0.5)
	}
}))

const DesLangText = ({ data }) => {
	const cls = useStyles()

	return (
		<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
			<Box display="flex">
				<FaceTwoToneIcon className={cls.mr} fontSize="small" color="primary" />
				<Typography variant="caption">{data.designers.join(', ')}</Typography>
			</Box>

			<Box display="flex">
				<PublicTwoToneIcon className={cls.mr} fontSize="small" color="primary" />
				<Typography variant="caption">{data.languageDependence}</Typography>
			</Box>
		</Box>
	)
}

export default DesLangText
