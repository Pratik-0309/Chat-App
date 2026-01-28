import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div className="min-h-screen w-full bg-black bg-[url('./src/assets/bgImage.svg')] bg-no-repeat bg-contain bg-center">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/Profile' element={<Profile/>} />
      </Routes>
    </div>
  )
}

export default App