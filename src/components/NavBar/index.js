import React from "react";

function NavBar({ onOptionClick }) {

    return (
    <>
        <div className="appNav">
            <button className="textButton" onClick={ () => onOptionClick("options") }>Options</button>
            {/* <button className="textButton" onClick={ () => onOptionClick("help") }>Help</button> */}
        </div>
    </>
    );
}

export default NavBar;
