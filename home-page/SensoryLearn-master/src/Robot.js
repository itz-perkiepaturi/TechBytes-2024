import React from 'react'
import './robo.css'

function Robot() {
  return (
    <main>
        <div id="qwe">
        <div id="sketch-board-con">
            <div id="sketch-board">
                <div id="head">
                    <div id="lens">
                        <div id="upper-shadow" ></div>
                        <div id="rect"></div>
                        <div id="eyes"></div>
                    </div>
                </div>

                <div id="ear">
                    <div id="ear-antenna"></div>
                </div>

                <div id="small-cap"></div>

                <div id="body">
                    <div id="shadow-box"></div>
                    <div id="pocket-area">
                        <div id="pocket"></div>
                    </div>    
                </div>

                <div id="hands">
                    <div class="hand"></div>
                    <div class="hand"></div>
                </div>

            </div>

            <div id="robot-shadow">

            </div>
        </div>
        </div>
    </main>
  )
}

export default Robot