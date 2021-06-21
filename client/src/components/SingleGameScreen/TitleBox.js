import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
	title    : {
		fontSize                       : theme.typography.h4.fontSize,
		[theme.breakpoints.down('sm')]: {
			fontSize : theme.typography.h5.fontSize
		}
	},
	subtitle : {
		display                        : 'flex',
		justifyContent                 : 'flex-end',
		fontStyle                      : 'italic',
		color                          : theme.palette.common.white,
		[theme.breakpoints.down('sm')]: {
			alignItems     : 'center',
			justifyContent : 'center'
		}
	}
}))

const TitleBox = ({ data }) => {
	const cls = useStyles()

	return (
		<Box display="flex" flexDirection="column" my={1}>
			<Box className={cls.title}>{data.title}</Box>
			<Box className={cls.subtitle}>
				<Typography variant="caption">
					<Box>{data.type}</Box>
				</Typography>
				<Typography variant="caption">
					<Box ml={2}>{data.year}</Box>
				</Typography>
			</Box>
		</Box>
	)
}

export default TitleBox
