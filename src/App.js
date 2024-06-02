import React, { useState, useEffect } from 'react';
import logo from './hot-logo.svg';
import './App.css';
import FileUpload from './components/FileUpload'
import Map from './components/Map'
import WhatsAppParser from './components/WhatsAppParser';
import DownloadButton from './components/DownloadButton';
import NavBar from './components/NavBar';

// import OptionButton from './components/OptionButton';

function App() {

  const [content, setContent] = useState(null);
  const [data, setData] = useState(null);
  const [msgPosition, setMsgPosition] = useState("mixed");

  
  const handlePositionChange = (position) => {
    setData(null);
    setMsgPosition(position);
    setContent(content + " ")
  }

  const handleFile = (fileContent) => {
    setContent(fileContent)
  }

  const handleParser = (geoJson) => {
    setData(geoJson);
    if (geoJson.features.length === 0) {
      setContent(null);
    }
  }

  const handleNewUploadClick = () => {
    setContent(null);
    setData(null);
  }


  return (
    <div className="app">
      <header className="header">
        <div class="top">
          <NavBar  />
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
        <div className="fileUpload">
          <FileUpload onFileLoad={(fileContent) => handleFile(fileContent)}/>
        </div>
      }
       { content &&
        <div className="messageParser">
          <WhatsAppParser msgPosition={msgPosition} text={content} onParseText={handleParser} />
        </div>
      }
      { data && data.features.length > 0 && 
        <div className="data">
          {/* <OptionButton left active={msgPosition === "before"} value="Before" onClick={() => handlePositionChange("before")} />
          <OptionButton right active={msgPosition === "after"} value="After" onClick={() => handlePositionChange("after")} /> */}
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
