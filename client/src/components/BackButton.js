// @ Libraries
import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

// @ Mui
import IconButton from '@mui/material/IconButton'

// @ Icons
import KeyboardBackspaceTwoToneIcon from '@mui/icons-material/KeyboardBackspaceTwoTone'

// @ Main
const BackButton = () => {
	const history = useHistory()

	return (
        <Fragment>
			<IconButton onClick={() => history.goBack()} size="large">
				<KeyboardBackspaceTwoToneIcon color="primary" />
			</IconButton>
		</Fragment>
    );
}

export default BackButton
