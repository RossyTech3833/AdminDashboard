import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import './App.css'
import Home from './Home'
import { MembersDetails } from './MembersDetails'
import Footer from './Footer'




function App() {
  return (
    
      <div>
        <Router>
          <Routes>
            <Route path='/' element = {<Home/>}/>
            <Route path='users/:id' element={<MembersDetails />} />
            <Route path ='users' element={<Home/>} />
          </Routes>
        </Router>
        <Footer/>
        
      </div>
    
  )
}

export default App
