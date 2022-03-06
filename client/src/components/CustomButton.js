// @ Modules
import React from 'react'

// @ Mui
import Button from '@mui/material/Button'

// @ Main
const CustomButton = ({ children, ...other }) => {
	return <Button {...other}>{children}</Button>
}

// @ Default Props
CustomButton.defaultProps = {
	color : 'primary'
}

export default CustomButton
