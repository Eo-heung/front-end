import React, { useState } from "react";
import "../../css/partials/Popup.css";

const Popup = ({ isOpen, onClose, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="popup-content"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
      >
        {children}
        <div>
          <button onClick={onClose}>친구하기(곶감 5개)</button>
          <button onClick={onClose}>손절하기</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
