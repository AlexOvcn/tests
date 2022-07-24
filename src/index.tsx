import ReactDOM from 'react-dom/client';
import { setupStore } from './redux/store';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';

const store = setupStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);