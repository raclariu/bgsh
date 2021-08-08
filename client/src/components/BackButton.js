// @ Libraries
import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

// @ Mui
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import KeyboardBackspaceTwoToneIcon from '@material-ui/icons/KeyboardBackspaceTwoTone'

// @ Main
const BackButton = () => {
	const history = useHistory()

	return (
		<Fragment>
			<IconButton onClick={() => history.goBack()}>
				<KeyboardBackspaceTwoToneIcon color="primary" />
			</IconButton>
		</Fragment>
	)
}

export default BackButton
