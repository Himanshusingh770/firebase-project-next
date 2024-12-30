"use client"

import React, { useState, useRef } from "react";
import Modal from "react-modal";
import Webcam from "react-webcam";
import { FaSync, FaCamera } from "react-icons/fa";

const CameraModal = ({ setShowCamera, setImage }) => {
  const [facing, setFacing] = useState("user"); 
  const webcamRef = useRef(null);

  const takePicture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); 
      setShowCamera(false); 
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => setShowCamera(false)}
      contentLabel="Camera Modal"
      ariaHideApp={false}
      style={{
        content: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "95%",
          height: "95%",
          backgroundColor: "transparent",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          height="100%"
          videoConstraints={{
            facingMode: facing,
          }}
        />
        <div style={{ position: "absolute", bottom: 30, width: "100%", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={toggleCameraFacing}
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "gray",
                border: "none",
              }}
            >
              <FaSync size={24} color="white" />
            </button>
            <button
              onClick={takePicture}
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "gray",
                border: "none",
              }}
            >
              <FaCamera size={24} color="white" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CameraModal;
