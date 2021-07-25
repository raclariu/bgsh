import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Switch from '@material-ui/core/Switch'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import IconButton from '@material-ui/core/IconButton'
import { setCurrentTheme } from '../actions/userActions'

const Theme = () => {
	const dispatch = useDispatch()

	const theme = useSelector((state) => state.userPreferences.theme)

	const changeHandler = (e, current) => {
		dispatch(setCurrentTheme(current === 'light' ? 'dark' : 'light'))
	}

	return (
		<Fragment>
			{/* <BrightnessHighTwoToneIcon fontSize="small" />
			<Switch size="small" checked={theme === 'light' ? false : true} onChange={changeHandler} />
			<Brightness4TwoToneIconfontSize="small" /> */}
			<IconButton onClick={(e) => changeHandler(e, theme)}>
				{theme === 'light' ? <Brightness4Icon color="primary" /> : <Brightness7Icon color="secondary" />}
			</IconButton>
		</Fragment>
	)
}

export default Theme
