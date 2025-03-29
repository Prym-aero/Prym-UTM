import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Map from './pages/Map'
import AddZonePage from './pages/AddZonePage';
import Profile from './pages/Profile';
import FlightPlanForm from './pages/FlightPlans';
import ResetPassword from './pages/ResetPassword';
import './App.css'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map/>}/>
        <Route path='/addzone' element={<AddZonePage/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/flightPlan' element={<FlightPlanForm/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
