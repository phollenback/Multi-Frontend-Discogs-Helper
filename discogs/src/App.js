import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import PrivateRoute from './PrivateRoute';
import HomeScreen from './components/Home/HomeScreen'
import SearchScreen from './components/Search/SearchScreen';
import OneRelease from './components/Releases/OneRelease';
import CollectionScreen from './components/UserInfo/CollectionScreen';
import WantlistScreen from './components/UserInfo/WantlistScreen';
import Navbar from './components/All/Navbar';
import EditItem from './components/UserInfo/EditItem';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />

        <Routes>
          <Route path='/' element={<LoginForm/>}/>

          <Route path='/home' element={
            <PrivateRoute>
              <HomeScreen/>
            </PrivateRoute>
          }/>
          <Route path='/collection' element={
            <PrivateRoute>
              <CollectionScreen/>
            </PrivateRoute>
          }/>
          <Route path='/wantlist' element={
              <WantlistScreen/>
          }/>
          <Route path='/edit/:discogsId' element={
            <PrivateRoute>
              <EditItem/>
            </PrivateRoute>
          }/>
          <Route path='/search'element={
            <SearchScreen/>
          }
          />
          <Route path='/release/:id'element={
            <OneRelease/>
          }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
