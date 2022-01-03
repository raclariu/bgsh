// @ Libraries
import React, { Fragment } from 'react'
import { isMobile } from 'react-device-detect'

// @ Mui
import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'

// @ Main
const Hero = ({ children }) => {
	return (
		<Fragment>
			<Box mt={2} mb={4} p={1} display="flex" width="100%" flexDirection="column">
				{children}
			</Box>
		</Fragment>
	)
}

export default Hero
