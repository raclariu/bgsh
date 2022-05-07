// @ Modules
import React from 'react'

// @ Mui
import Button from '@mui/material/Button'

// @ Main
const CustomBtn = ({ children, ...other }) => {
	return <Button {...other}>{children}</Button>
}

export default CustomBtn
