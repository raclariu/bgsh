// @ Libraries
import React from 'react'
import { Helmet } from 'react-helmet'

// @ Main
const HelmetComponent = ({ title }) => {
	return (
		<Helmet>
			<title>{title}</title>
		</Helmet>
	)
}

export default HelmetComponent
