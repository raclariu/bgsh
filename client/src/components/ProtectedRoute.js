import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({ children: component, ...rest }) => {
	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	return (
		<Route
			{...rest}
			render={(props) => {
				console.log('protRoute', { props })
				if (userInfo) {
					return component
				} else {
					return <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
				}
			}}
		/>
	)
}

export default ProtectedRoute
