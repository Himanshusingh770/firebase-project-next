import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImagePicker = ({ setImage }) => {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          if (rejection.errors[0].code === "file-too-large") {
            alert("File is too large! Max size is 5MB.");
          } else {
            alert("Invalid file type.");
          }
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
    maxFiles: 1,
    maxSize: 5000000,
  });

  return (
    <div {...getRootProps()} style={dropzoneStyle} aria-label="Image upload area">
      <input {...getInputProps()} aria-label="Select an image file" />
      <p>Drag & drop an image here, or click to select one</p>
    </div>
  );
};

const dropzoneStyle = {
  border: "2px dashed #cccccc",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default ImagePicker;
