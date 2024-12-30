"use client"

import React from "react";

const ErrorComponent = ({ errorMessage }) => {
  return (
    errorMessage && (
      <div style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}>
        {errorMessage}
      </div>
    )
  );
};

export default ErrorComponent;
