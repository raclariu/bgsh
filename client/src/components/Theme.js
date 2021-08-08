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

// @ Main
const Theme = () => {
	const dispatch = useDispatch()

	const theme = useSelector((state) => state.userPreferences.theme)

	const changeHandler = (e, current) => {
		dispatch(setCurrentTheme(current === 'light' ? 'dark' : 'light'))
	}

	return (
		<Fragment>
			<IconButton onClick={(e) => changeHandler(e, theme)}>
				{theme === 'light' ? <Brightness4Icon color="primary" /> : <Brightness7Icon color="secondary" />}
			</IconButton>
		</Fragment>
	)
}

export default Theme
