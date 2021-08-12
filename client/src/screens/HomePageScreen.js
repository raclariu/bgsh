// @ Libraries
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ Others
import { bggGetHotGames } from '../actions/gameActions'

// @ Main
const HomePageScreen = () => {
	const dispatch = useDispatch()

	useEffect(
		() => {
			dispatch(bggGetHotGames())
		},
		[ dispatch ]
	)

	return <div>Home</div>
}

export default HomePageScreen
