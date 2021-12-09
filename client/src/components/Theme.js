// @ Libraries
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ Mui
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

// @ Others
import { setCurrentTheme } from '../actions/userActions'
import { useNotification } from '../hooks/hooks'

// @ Main
const Theme = () => {
	const dispatch = useDispatch()

	const [ showSnackbar ] = useNotification()

	const theme = useSelector((state) => state.userPreferences.theme)

	const changeHandler = (e, current) => {
		const text = current === 'light' ? 'Switched to dark theme' : 'Switched to light theme'
		dispatch(setCurrentTheme(current === 'light' ? 'dark' : 'light'))
		showSnackbar.info({ text })
	}

	return (
		<Fragment>
			<IconButton color="primary" onClick={(e) => changeHandler(e, theme)}>
				{theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon color="secondary" />}
			</IconButton>
		</Fragment>
	)
}

export default Theme
