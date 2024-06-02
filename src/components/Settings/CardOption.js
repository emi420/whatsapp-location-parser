import React from "react";

function CardOption({ img, title, children }) {

  return (
    <div className="cardOption">
        <img className="cardOptionImage" src={img} alt={title} />
        <h3>{title}</h3>
        {children}
    </div>

  );
}

export default CardOption;
