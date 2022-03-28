// @ Modules
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ Icons
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

// @ Components
import CustomIconBtn from './CustomIconBtn'

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
			<CustomIconBtn color="primary" onClick={(e) => changeHandler(e, theme)} size="large">
				{theme === 'light' ? <Brightness4Icon color="secondary" /> : <Brightness7Icon color="secondary" />}
			</CustomIconBtn>
		</Fragment>
	)
}

export default Theme
