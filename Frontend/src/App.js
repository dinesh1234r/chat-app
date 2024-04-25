import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import SetAvatar from './pages/SetAvatar'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/setAvatar' element={<SetAvatar/>}/>
      </Routes>
    </Router>
  )
}

export default App