// @ Libraries
import { createMuiTheme } from '@material-ui/core/styles'

// @ Light
export const light = createMuiTheme({
	palette : {
		type      : 'light',
		primary   : {
			main : '#651fff'
		},
		secondary : {
			main : '#ff3d00'
		}
	}
})

// @ Dark
export const dark = createMuiTheme({
	palette : {
		type       : 'dark',
		primary    : {
			main : '#bb86fc'
		},
		secondary  : {
			main : '#03dac5'
		},
		background : {
			paper   : '#332940',
			default : '#1f1a24'
		}
	}
})

// export const dark = createMuiTheme({
// 	palette : {
// 		type       : 'dark',
// 		primary    : {
// 			main : '#bb86fc'
// 		},
// 		secondary  : {
// 			main : '#03dac5'
// 		},
// 		background : {
// 			paper   : 'rgb(35 47 68)',
// 			default : 'rgb(27 38 53)'
// 		}
// 	}
// })
