// @ Modules
import { createTheme } from '@mui/material/styles'

// @ Light
export const light = createTheme({
	palette : {
		mode       : 'light',
		primary    : {
			main : '#651fff'
		},
		secondary  : {
			main : '#ff3d00'
		},
		background : {
			paper   : '#ffffff',
			default : '#fcfcfc'
		}
	}
})

// @ Dark
export const dark = createTheme({
	palette : {
		mode       : 'dark',
		primary    : {
			main : '#58a5f0'
		},
		secondary  : {
			main : '#E94560'
		},
		background : {
			paper   : '#16213F',
			default : '#1A122E'
		}
	}
})
