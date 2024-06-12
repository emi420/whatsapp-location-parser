import React, { useState, useEffect } from 'react';
import logo from './hot-logo.svg';
import './App.css';
import FileUpload from './components/FileUpload'
import Map from './components/Map'
import DownloadButton from './components/DownloadButton';
import NavBar from './components/NavBar';
import NavModal from './components/NavModal';
import Settings from "./components/Settings";
import Help from "./components/Help";
import useSettings from './hooks/useSettings';
import useWhatsappParser from './hooks/useWhatsappParser';

function App() {

  const [content, setContent] = useState(null);
  const [data, setData] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [settings, handleSettingsChange] = useSettings({
    msgPosition: "closest"
  });
  const [geoJson] = useWhatsappParser({ text: content, msgPosition: settings.msgPosition});

  const getPositionLabel = (position) => {
    if (position === "after") {
      return "next";
    } else if (position === "before") {
      return "previous";
    }
    return "closest";
  }
  
  const handleFile = (fileContent) => {
    setContent(fileContent)
  }

  useEffect(() => {
    if (!geoJson) return;
    setData(geoJson);
  }, [geoJson]);
  
  const handleNewUploadClick = () => {
    setContent(null);
    setData(null);
  }

  const handleModalClose = () => {
    setModalContent(null);
  }

  useEffect(() => {
    setData(null);
    setModalContent(null);
  }, [settings.msgPosition])

  return (
    <div className="app">
      <header className="header">
        <div className="top">
          <NavBar onOptionClick={(option) => {
            if (option === "options") {
                setModalContent(<Settings settings={settings} onChange={handleSettingsChange} />)
            } else if (option === "help") {
                setModalContent(<Help />)
            }
          }} />
          <NavModal isOpen={modalContent !== null} onClose={handleModalClose} content={modalContent} />
        </div>
        <h1>WhatsApp <strong>Location Parser</strong></h1>
        { data && data.features.length > 0 ?
        <div className="fileOtions">
            <DownloadButton data={data} filename="whatsapp-locations" />
            <button onClick={handleNewUploadClick} className="secondaryButton">Upload new file</button>
        </div>
        :
        <>
          <p>
            Export a chat from the app and visualize the locations shared in the conversation
          </p>
          <div className="copy">
            <span>Free and Open Source Software by</span>
            <img src={logo} className="logo" alt="logo" />
          </div>
        </>
      }
      </header>
      { !content &&
        <>
          <div className="fileUpload">
            <FileUpload onFileLoad={(fileContent) => handleFile(fileContent)}/>
          </div>
          <p>Will search for locations and the <strong>{getPositionLabel(settings.msgPosition)}</strong> message from the same user.</p>
        </>
      }
      { data && data.features.length > 0 && 
        <div className="data">
          <div className="map">
            <Map data={data} />
          </div>
        </div>
      }
      { data && data.features.length === 0 && 
        <h2>No locations found in this file.</h2>
      }
    </div>
  );
}

export default App;
