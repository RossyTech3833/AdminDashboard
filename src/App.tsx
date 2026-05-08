import { HashRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import { MembersDetails } from './components/MembersDetails'
import Footer from './Shared/Footer'




function App() {
  return (
    
      <div>
        <HashRouter>
          <Routes>
            <Route path='/' element = {<Home/>}/>
            <Route path='users/:id' element={<MembersDetails />} />
            <Route path ='users' element={<Home/>} />
          </Routes>
        </HashRouter>
        <Footer/>
        
      </div>
    
  )
}

export default App
