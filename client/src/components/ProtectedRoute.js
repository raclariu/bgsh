// @ Modules
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

// @ Main
const ProtectedRoute = ({ children }) => {
	const location = useLocation()

	const { userData } = useSelector((state) => state.userAuth)

	if (!userData) {
		return <Navigate to="/login" state={{ from: location.pathname }} replace />
	}

	return children
}

export default ProtectedRoute
