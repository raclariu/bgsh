import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
	root : {
		display                        : 'flex',
		flexDirection                  : 'column',
		justifyContent                 : 'center',
		alignItems                     : 'center',
		marginBottom                   : theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			marginTop    : theme.spacing(1),
			marginBottom : theme.spacing(1)
		}
	}
}))

const TitleBox = ({ title, year, type }) => {
	const cls = useStyles()

	return (
		<Box className={cls.root} textAlign="center">
			<Box fontSize={25}>{title}</Box>
			<Box display="flex" justifyContent="center" alignItems="center">
				<Box fontStyle="italic" fontSize={12} color="grey.600" component="span" letterSpacing="0.03333em">
					{type}
				</Box>
				<Box
					fontStyle="italic"
					ml={2}
					fontSize={12}
					color="grey.600"
					component="span"
					letterSpacing="0.03333em"
				>
					{year}
				</Box>
			</Box>
		</Box>
	)
}

export default TitleBox
