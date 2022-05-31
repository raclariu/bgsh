// @ Modules
import React from 'react'
import { Helmet } from 'react-helmet'

// @ Main
const CustomHelmet = ({ title, description, img = null }) => {
	return (
		<Helmet>
			<title>{title || 'Meeples.ro'}</title>
			<meta name="title" content={title || 'Meeples.ro'} data-react-helmet="true" />
			<meta
				name="description"
				content={description || 'Sell or trade board games from your collection to other players'}
				data-react-helmet="true"
			/>
			{img && <meta property="og:image" content={img} />}
		</Helmet>
	)
}

export default CustomHelmet
