// @ Modules
import React from 'react'

// @ Mui
import LoadingButton from '@mui/lab/LoadingButton'

// @ Main
const LoadingBtn = ({ children, ...other }) => {
	return <LoadingButton {...other}>{children}</LoadingButton>
}

export default LoadingBtn
