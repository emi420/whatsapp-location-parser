import React, { useState } from "react";
import NavModal from '../NavModal';
import Settings from "../Settings";
import Help from "../Help";

function NavBar() {

    const [modalContent, setModalContent] = useState(null);

    const handleNavOptionClick = (option) => {
        if (option === "options") {
            setModalContent(<Settings />)
        } else if (option === "help") {
            setModalContent(<Help />)
        }
    }

    const handleModalClose = () => {
        setModalContent(null);
    }

    return (
    <>
        <div className="appNav">
            <button className="textButton" onClick={ () => handleNavOptionClick("options") }>Options</button>
            <button className="textButton" onClick={ () => handleNavOptionClick("help") }>Help</button>
        </div>
        <NavModal isOpen={modalContent !== null} onClose={handleModalClose} content={modalContent} />
    </>
    );
}

export default NavBar;
