// @ Modules
import React from 'react'
import { Helmet } from 'react-helmet'

// @ Main
const CustomHelmet = ({ title, description }) => {
	return (
		<Helmet>
			<title>{title || 'Meeples.Ro'}</title>
			<meta
				name="description"
				content={description || 'Sell or trade board games from your collection to other players'}
			/>
		</Helmet>
	)
}

export default CustomHelmet
