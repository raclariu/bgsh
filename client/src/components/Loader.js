// @ Modules
import React from 'react'

// @ Mui
import CircularProgress from '@mui/material/CircularProgress'

// @ Main
const Loader = ({ size, color }) => {
	return <CircularProgress size={size} color={color} />
}

// @ Default Props
Loader.defaultProps = {
	size  : 40,
	color : 'primary'
}

export default Loader
