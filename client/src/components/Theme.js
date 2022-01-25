// @ Libraries
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ Mui
import IconButton from '@mui/material/IconButton'

// @ Icons
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

// @ Others
import { setCurrentTheme } from '../actions/userActions'
import { useNotiSnackbar } from '../hooks/hooks'

// @ Main
const Theme = () => {
	const dispatch = useDispatch()

	const [ showSnackbar ] = useNotiSnackbar()

	const theme = useSelector((state) => state.userPreferences.theme)

	const changeHandler = (e, current) => {
		const text = current === 'light' ? 'Switched to dark theme' : 'Switched to light theme'
		dispatch(setCurrentTheme(current === 'light' ? 'dark' : 'light'))
		showSnackbar.info({ text })
	}

	return (
		<Fragment>
			<IconButton color="primary" onClick={(e) => changeHandler(e, theme)} size="large">
				{theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon color="secondary" />}
			</IconButton>
		</Fragment>
	)
}

export default Theme
