import React from 'react';
import HeroSection from './HeroSection';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour } from './HomeData';
import Header from './Components/Header';
import Footer from './Components/Footer';

function Home() {
  return (
    
    <>
    <Header />
      <HeroSection {...homeObjOne} />
      <HeroSection {...homeObjThree} />
      <HeroSection {...homeObjTwo} />

    <Footer />
      
      
      
    </>
  );
}

export default Home;