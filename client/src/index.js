import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import App from './App';
import toast, { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import axios from 'axios'
import store from './redux/store';


axios.defaults.baseURL='http://localhost:8000'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>
    <React.StrictMode>
        <App />
      <Toaster />
    </React.StrictMode>

  </Provider>

);

