// @ Libraries
import React, { Fragment } from 'react'

// @ Mui
import Divider from '@mui/material/Divider'

const CustomDivider = ({ children, ...other }) => {
	console.log(children)
	return <Divider {...other}>{children}</Divider>
}

// @ Default Props
CustomDivider.defaultProps = {
	light : true
}

export default CustomDivider
