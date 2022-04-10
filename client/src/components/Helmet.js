// @ Modules
import React from 'react'
import { Helmet } from 'react-helmet'

// @ Main
const CustomHelmet = ({ title }) => {
	return (
		<Helmet>
			<title>{title || 'Meeples.Ro'}</title>
		</Helmet>
	)
}

export default CustomHelmet
