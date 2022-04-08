// @ Modules
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'

// @ Main
const ProtectedRoute = ({ children }) => {
	const location = useLocation()

	const { success } = useSelector((state) => state.userData)

	if (!success) {
		return <Navigate to="/login" state={{ from: location.pathname }} replace />
	}

	return children
}

export default ProtectedRoute
