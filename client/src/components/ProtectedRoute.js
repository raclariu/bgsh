// @ Modules
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

// @ Main
const ProtectedRoute = ({ children: component, ...rest }) => {
	const { userData } = useSelector((state) => state.userAuth)

	return (
		<Route
			{...rest}
			render={(props) => {
				if (userData) {
					return component
				} else {
					return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
				}
			}}
		/>
	)
}

export default ProtectedRoute
