
import './App.css'
import Index from './components/Index/Index'

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Songs from './components/Songs/Songs';

function App() {



  return(
    <div className='main-container'>
      <BrowserRouter>
      
        <Routes>
          <Route path='/*' element={<Index/>} />
          <Route path='/rememberYou' element = {<Songs/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )

}

export default App
