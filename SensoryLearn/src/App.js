import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../src/Components/Header.js';
import Footer from '../src/Components/Footer.js';
import Home from './Home.js';
import Doubts from './Doubts.js';
import Subjects from './Subjects.js';
import SignIn from './SignIn/signin.js';
import Topic from './Pages/Topic.js';



const App = () => {
  return (
    <div className="App">
     
      <Router>
      {/* <Header /> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/landing' element={<Home />} />
          <Route path='/ask-doubts' element={<Doubts />} />
          <Route path='/subjects' element={<Subjects />} />
          <Route path='/topic' element={<Topic />} />
          <Route path='/signin' element={<SignIn />} />
        </Routes>
      
      {/* <Footer /> */}
      </Router>
    </div>
  );
};

export default App;
