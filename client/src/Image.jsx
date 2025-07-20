import React from "react";

function Image() {
  return (
    <div className="image-container">
      <img
        src="./logo.gif"
        alt="Skribbl Logo"
         style={{
    width: "200px",      // adjust this value as needed
    height: "auto",
     objectFit: 'contain',
      display: 'flex',
      transform: 'scale(2.2)',
      margin:"0px 0px  0px 200px",
      padding: '0px'

}}
      />
    </div>
  );
}
export default Image;