// @ Libraries
import React from 'react'

// @ Mui
import IconButton from '@mui/material/IconButton'

const CustomIconBtn = ({ children, ...other }) => {
	return <IconButton {...other}>{children}</IconButton>
}

export default CustomIconBtn
