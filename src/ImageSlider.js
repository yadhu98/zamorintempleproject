import React, { useState } from "react";

import "./Slideshow.css";

const Slideshow = ({slides}) => {
  const [slideIndex, setSlideIndex] = useState(1);

 

  const showDivs = (n) => {
    if (n > slides.length) {
      setSlideIndex(1);
    } else if (n < 1) {
      setSlideIndex(slides.length);
    } else {
      setSlideIndex(n);
    }
  };

  const plusDivs = (n) => {
    showDivs(slideIndex + n);
  };

  const currentDiv = (n) => {
    showDivs(n);
  };

  return (
    <div className="w3-content w3-display-container" style={{ maxWidth: "800px", position: "relative" }}>
      {slides?.map((slide, index) => (
        <img
          key={index}
          src={slide}
          alt={`Slide ${index + 1}`}
          className="mySlides"
          style={{
            width: "100%",
            height : '400px',
            display: slideIndex === index + 1 ? "block" : "none",
          }}
        />
      ))}
      <button
        className="w3-left w3-hover-text-khaki"
        onClick={() => plusDivs(-1)}
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: "0",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
          color: "white",
        }}
      >
        &#10094;
      </button>
      <button
        className="w3-right w3-hover-text-khaki"
        onClick={() => plusDivs(1)}
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: "0",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
          color: "white",
        }}
      >
        &#10095;
      </button>
      <div
        className="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle"
        style={{ width: "100%", position: "absolute", bottom: "10px" }}
      >
        {slides?.map((_, index) => (
          <span
            key={index}
            className={`w3-badge demo w3-border w3-transparent w3-hover-white ${
              slideIndex === index + 1 ? "w3-white" : ""
            }`}
            onClick={() => currentDiv(index + 1)}
            style={{
              cursor: "pointer",
              height: "13px",
              width: "13px",
              margin: "5px",
              display: "inline-block",
              borderRadius: "50%",
              backgroundColor: slideIndex === index + 1 ? "white" : "transparent",
              border: "1px solid white",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
