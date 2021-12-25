// @ Libraries
import { createTheme, adaptV4Theme } from '@mui/material/styles';

// @ Light
export const light = createTheme(adaptV4Theme({
	palette : {
		type      : 'light',
		primary   : {
			main : '#651fff'
		},
		secondary : {
			main : '#ff3d00'
		}
	}
}))

// // @ Dark
// export const dark = createTheme({
// 	palette : {
// 		type       : 'dark',
// 		primary    : {
// 			main         : '#bb86fc',
// 			contrastText : '#fff'
// 		},
// 		secondary  : {
// 			main : '#03dac5'
// 		},
// 		background : {
// 			paper   : '#332940',
// 			default : '#1f1a24'
// 		}
// 	}
// })

export const dark = createTheme(adaptV4Theme({
	palette : {
		type       : 'dark',
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
}))
