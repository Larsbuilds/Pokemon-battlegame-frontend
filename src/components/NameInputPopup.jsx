import React, { useState } from "react";

const NameInputPopup = ({
  onSubmit,
  initialName = "",
  showWarning,
  acceptExisting,
  existingNameAccept,
}) => {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <>
          {showWarning && (
            <h2
              style={{
                marginBottom: "1.0rem",
                color: "red",
                textAlign: "center",
                fontSize: "1.5rem",
              }}
            >
              Such name already exists!
            </h2>
          )}
        </>
        {!existingNameAccept && showWarning && (
          <button
            style={{
              marginBottom: "1rem",
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
              color: "#ffffff",
              textAlign: "center",
              fontSize: "1.1rem",
              fontWeight: "600",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              outline: "none",
            }}
            onClick={acceptExisting}
          >
            Accept anyway
          </button>
        )}
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#333",
            textAlign: "center",
            fontSize: "1.5rem",
          }}
        >
          Enter Your Name
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              border: "2px solid #2196F3",
              borderRadius: "6px",
              marginBottom: "1rem",
              outline: "none",
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
          >
            Start Your Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputPopup;
