import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Robot from './images/robot.jpg';
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';
import { useNavigate } from 'react-router-dom';
import Robo from './Robot.js'

// const waveAnimation = keyframes`
//   0%, 100% {
//     transform: rotate(0deg);
//   }
//   25% {
//     transform: rotate(20deg);
//   }
//   75% {
//     transform: rotate(-20deg);
//   }
// `;

const Body = styled.div`
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
`;

const WelcomeSection = styled.div`
  background-color: #f7f7f7;
  text-align: center;
  padding: 50px;
  height: 100%;
  padding-top: 180px;
`;

const RobotContainer = styled.div`
  margin-bottom: 20px;
`;

// const RobotImage = styled.img`
//   width: 150px;
//   height: 150px;
//   animation: ${waveAnimation} 2s infinite;
// `;

const RobotText = styled.p`
  font-size: 18px;
  color: #333;
`;

const SubjectOptions = styled.div`
  margin-top: 30px;
`;

const Heading2 = styled.h2`
  font-size: 24px;
  color: #333;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const OptionListItem = styled.li`
  display: inline-block;
  margin: 10px;
`;

const OptionLink = styled.a`
  text-decoration: none;
  color: #007bff;
  font-size: 16px;
  padding: 10px 20px;
  border: 2px solid #007bff;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

const SelectedOptionsContainer = styled.div`
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  text-align: left;
`;

const SelectedOptionsText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const GoButton = styled.button`
  background-color: #aed9e0;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Subjects = () => {
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  const handleGoButtonClick = () => {
    console.log("Redirecting to", selectedSubject);
    console.log("Age:", selectedAge, "Language:", selectedLanguage, "Subject:", selectedSubject)
    const url = `/topic?param1=${selectedAge}&param2=${selectedLanguage}&param3=${selectedSubject}&param4=1`;
    console.log("URL:", url);
    navigate(url);
  };

  return (
    <>
      <Header />
      <Body>
        <WelcomeSection>
          <RobotContainer>
            <Robo/>
            <RobotText>Hello, I'm your BotTeacher!</RobotText>
          </RobotContainer>
          <SubjectOptions>
            <Heading2>Choose Age</Heading2>
            <OptionsList>
              <OptionListItem>
                <OptionLink onClick={() => setSelectedAge("3-6")}>3-6 Years</OptionLink>
              </OptionListItem>
              <OptionListItem>
                <OptionLink onClick={() => setSelectedAge("7-12")}>7-12 Years</OptionLink>
              </OptionListItem>
              <OptionListItem>
                <OptionLink onClick={() => setSelectedAge("13-18")}>13-18 Years</OptionLink>
              </OptionListItem>
            </OptionsList>
          </SubjectOptions>
          {selectedAge && (
            <SubjectOptions>
              <Heading2>Choose Language</Heading2>
              <OptionsList>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedLanguage("english")}>English</OptionLink>
                </OptionListItem>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedLanguage("hindi")}>Hindi</OptionLink>
                </OptionListItem>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedLanguage("spanish")}>Spanish</OptionLink>
                </OptionListItem>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedLanguage("french")}>French</OptionLink>
                </OptionListItem>
              </OptionsList>
            </SubjectOptions>
          )}
          {selectedAge && selectedLanguage && (
            <SubjectOptions>
              <Heading2>Choose Subject</Heading2>
              <OptionsList>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedSubject("english")}>English</OptionLink>
                </OptionListItem>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedSubject("maths")}>Mathematics</OptionLink>
                </OptionListItem>
                <OptionListItem>
                  <OptionLink onClick={() => setSelectedSubject("geography")}>Geography</OptionLink>
                </OptionListItem>
              </OptionsList>
            </SubjectOptions>
          )}

          {selectedAge || selectedLanguage || selectedSubject ? (
            <SelectedOptionsContainer>
              <div>
                <Heading2>Selected Options</Heading2>
                {selectedAge && <SelectedOptionsText>Age: {selectedAge}</SelectedOptionsText>}
                {selectedLanguage && <SelectedOptionsText>Language: {selectedLanguage}</SelectedOptionsText>}
                {selectedSubject && <SelectedOptionsText>Subject: {selectedSubject}</SelectedOptionsText>}
              </div>
              {selectedAge && selectedLanguage && selectedSubject && (
                <GoButton onClick={handleGoButtonClick}>Go to {selectedSubject}</GoButton>
              )}
            </SelectedOptionsContainer>
          ) : null}
        </WelcomeSection>
      </Body>
      <Footer />
    </>
  );
};

export default Subjects;
