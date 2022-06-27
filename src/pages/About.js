import React, { Component } from 'react';
import "./About.css";
import profile_pic_name from "../assets/profile_pic_name.JPG";
  
export default class About extends Component {
  render() {
    return (
        <div>
            <div class="split left">
                <div className="centered">
                <img 
                    className="profile_image"
                    src={profile_pic_name}
                    alt="Profile Pic"
                    ></img>
                </div>
            </div>
            <div className="split right">
                <div className="centered">
                <div className="name_title">Rohen Chawla❗</div>
                <div className="brief_description">
                    I like to sleep, jumprope, and skateboard at night.
                    <br></br>
                    I also tend to procrastinate on important work by doing busy work instead to feel productive. 🤩
                </div>
                </div>
            </div>
      </div>
    )
  }
}