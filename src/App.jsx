import React from 'react'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AllProjects from './components/AllProjects'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-projects" element={<AllProjects />} />
      </Routes>
    </Router>
  )
}

export default App
