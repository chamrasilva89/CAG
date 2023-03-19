import React from "react";
import photo1 from "../photos/photo_1.JPG";
import photo2 from "../photos/photo_2.JPG";
import photo3 from "../photos/photo_3.JPG";
import photo4 from "../photos/photo_4.JPG";
import photo5 from "../photos/photo_5.JPG";

const About = () => (
  <div>
    <h1 style={{ color: "blue", fontSize: "24px", textAlign: "center" }}>
      About our Team..!
    </h1>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ textAlign: "center", margin: "10px" }}>
        <img
          src={photo1}
          alt="Passport size photo 1: [insert photo name here]"
          style={{ width: "350px", height: "400px" }}
        />
        <p>~~ Chamara Silva ~~</p>
      </div>
      <div style={{ textAlign: "center", margin: "10px" }}>
        <img
          src={photo2}
          alt="Passport size photo 2: [insert photo name here]"
          style={{ width: "350px", height: "400px" }}
        />
        <p>~~ Pavithra Bethmage ~~</p>
      </div>
      <div style={{ textAlign: "center", margin: "10px" }}>
        <img
          src={photo3}
          alt="Passport size photo 3: [insert photo name here]"
          style={{ width: "350px", height: "400px" }}
        />
        <p>~~ Sudhagar Subramaniyam ~~</p>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ textAlign: "center", margin: "10px" }}>
        <img
          src={photo4}
          alt="Passport size photo 4: [insert photo name here]"
          style={{ width: "350px", height: "400px" }}
        />
        <p>~~ Madushani Jayasinghe ~~</p>
      </div>
      <div style={{ textAlign: "center", margin: "10px" }}>
        <img
          src={photo5}
          alt="Passport size photo 5: [insert photo name here]"
          style={{ width: "350px", height: "400px" }}
        />
        <p>~~ Kasun Kodithuwakku ~~</p>
      </div>
    </div>
  </div>
);

export default About;
