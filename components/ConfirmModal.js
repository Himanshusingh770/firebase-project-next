"use client"

import React from "react";

const ConfirmationModal = ({
  modalTitle,
  modalSubTitle,
  btnOkText,
  btnCancelText,
  onConfirm,
  onClose,
  visible,
  btnColor = "bg-green-300",
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-gray-200 w-[80%] max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
        <div className="p-6 text-left">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-1">
            <h2 className="text-lg font-bold">{modalTitle}</h2>
            {btnCancelText && (
              <button onClick={onClose} aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <p className="mb-6">{modalSubTitle}</p>

          {/* Footer */}
          <div
            className={`mt-7 flex gap-2 ${
              btnCancelText ? "justify-between" : "justify-end"
            }`}
          >
            {btnCancelText && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-800 rounded-md border hover:bg-gray-400"
              >
                {btnCancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md text-white ${btnColor}`}
            >
              {btnOkText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
