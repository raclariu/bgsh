import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import KeyboardBackspaceTwoToneIcon from '@material-ui/icons/KeyboardBackspaceTwoTone'

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
