import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Map from './pages/Map'
import AddZonePage from './pages/AddZonePage';
import Profile from './pages/Profile';
import FlightPlan from './pages/FlightPlans';
import ResetPassword from './pages/ResetPassword';
import Drone from './pages/Drone';
import './App.css'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map/>}/>
        <Route path='/addzone' element={<AddZonePage/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/flightPlan' element={<FlightPlan/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/drone' element={<Drone/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
