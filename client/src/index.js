// @ Libraries
import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'

// @ Store
import store from './store'

// @ App
import App from './App'

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
