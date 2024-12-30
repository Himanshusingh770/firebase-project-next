// import React, { useState, useCallback } from "react";
// import { useDropzone } from "react-dropzone";

// const ImagePicker = ({ setImage }) => {
//   const [isFilePickerOpen, setFilePickerOpen] = useState(false); // To control when to show file input dialog

//   const onDrop = useCallback(
//     (acceptedFiles, fileRejections) => {
//       if (fileRejections.length > 0) {
//         fileRejections.forEach((rejection) => {
//           if (rejection.errors[0].code === "file-too-large") {
//             alert("File is too large! Max size is 5MB.");
//           } else {
//             alert("Invalid file type.");
//           }
//         });
//         return;
//       }

//       const file = acceptedFiles[0];
//       if (file) {
//         const imageUrl = URL.createObjectURL(file);
//         setImage(imageUrl);
//       }
//     },
//     [setImage]
//   );

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop,
//     maxFiles: 1,
//     maxSize: 5000000, // Max file size (5MB)
//   });

//   // Function to trigger file input dialog manually
//   const handleFilePicker = () => {
//     setFilePickerOpen(true);
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
    
//     input.onchange = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         const imageUrl = URL.createObjectURL(file);
//         setImage(imageUrl);
//       } else {
//         alert("No file selected");
//       }
//     };

//     input.click(); // Trigger the file input dialog
//   };

//   return (
//     <div>
//       <div
//         {...getRootProps()}
//         style={dropzoneStyle}
//         aria-label="Image upload area"
//       >
//         <input {...getInputProps()} aria-label="Select an image file" />
//         <p>Drag & drop an image here, or click to select one</p>
//       </div>

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-md"
//         onClick={handleFilePicker}
//       >
//         Select Image
//       </button>
//     </div>
//   );
// };

// const dropzoneStyle = {
//   border: "2px dashed #cccccc",
//   borderRadius: "8px",
//   padding: "20px",
//   textAlign: "center",
//   cursor: "pointer",
// };

// export default ImagePicker;

// utils/handleImagePicker.js
export const handleImagePicker = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        resolve(imageUrl); // Resolve with image URL
      } else {
        reject('No file selected');
      }
    };

    input.click(); // Trigger the file input dialog
  });
};

