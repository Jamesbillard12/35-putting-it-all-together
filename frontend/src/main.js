import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux'

import appCreateStore from './lib/app-create-store.js'
import App from './component/app';


let store = appCreateStore();

let AppContainer = () => {
  return(
    <Provider store={store}>
      <App />
    </Provider>
  )
}
ReactDom.render(<AppContainer />, document.getElementById('root'))
