import { useEffect } from "react";
import { actionsOnTheResizeEvent, actionsOnTheScrollEvent } from "./redux/actionCreators";
import './App.scss';
import Header from './components/header/Header';
import Main from './components/main/Main';
import { useAppDispatch } from "./redux/hooks";
import {PopupMenu} from './components/menusAndNotifications/popupMenu/PopupMenu';


function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(actionsOnTheScrollEvent());
    dispatch(actionsOnTheResizeEvent());
  }, []);
  
  return (
    <div className="App">
      <Header />
      <Main />
      <PopupMenu/>
    </div>
  );
}

export default App;
