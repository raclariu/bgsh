// @ Libraries
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import ReactDOM from 'react-dom'

// @ Store
import store from './store'

// @ App
import App from './App'

const queryClient = new QueryClient({
	defaultOptions : {
		queries : {
			refetchOnWindowFocus : false
		}
	}
})

ReactDOM.render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} position="top-left" />
		</QueryClientProvider>
	</Provider>,
	document.getElementById('root')
)
