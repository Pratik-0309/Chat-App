import {Navigate,Route, Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Profile from './pages/Profile'
import {Toaster} from 'react-hot-toast'

import { useContext } from 'react'
import { AuthContext } from './context/AuthContext.jsx'

const App = () => {
  const {user } = useContext(AuthContext);
  return (
    <div className="min-h-screen w-full bg-black bg-[url('/bgImage.svg')] bg-no-repeat bg-contain bg-center">
      <Toaster position="top-right" toastOptions={{duration: 3000}} />
      <Routes>
        <Route path='/' element={user ? <Home/> : <Navigate to="/login" />} />
        <Route path='/login' element={!user ? <Login/> : <Navigate to="/" />} />
        <Route path='/profile' element={user ? <Profile/> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App