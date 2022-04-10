// @ Modules
import React from 'react'

// @ Mui
import Divider from '@mui/material/Divider'

const CustomDivider = ({ children, ...other }) => {
	return <Divider {...other}>{children}</Divider>
}

// @ Default Props
CustomDivider.defaultProps = {
	light : true
}

export default CustomDivider
