import React, { useState } from 'react';
import logo from './hot-logo.svg';
import './App.css';
import FileUpload from './components/FileUpload'
import Map from './components/Map'
import WhatsAppParser from './components/WhatsAppParser';
import DownloadButton from './components/DownloadButton';

function App() {

  const [content, setContent] = useState(null);
  const [data, setData] = useState(null);

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
        <h1>WhatsApp <strong>Location Parser</strong></h1>
        <p>
          Export a chat from the app and visualize the locations shared in the conversation
        </p>
      </header>
      { !content &&
        <div className="fileUpload">
          <FileUpload onFileLoad={(fileContent) => handleFile(fileContent)}/>
        </div>
      }
       { content &&
        <div className="messageParser">
          <WhatsAppParser text={content} onParseText={handleParser} />
        </div>
      }
      { data && data.features.length > 0 && 
        <div className="data">
          <div className="map">
            <Map data={data} />
          </div>
          <div className="options">
          <DownloadButton data={data} filename="whatsapp-locations" />
          <button onClick={handleNewUploadClick} className="secondaryButton">Upload a new file</button>
          </div>
        </div>
      }
      { data && data.features.length === 0 && 
        <h2>No locations found in this file.</h2>
      }
      <footer className="footer">
        <a href="https://github.com/emi420/whatsapp-location-parser/tree/master/docs">How to use it?</a>
        <br /> <br />
        <span className="copy">
          Free and Open Source Software by
        </span>
        <img src={logo} className="logo" alt="logo" />
      </footer>
    </div>
  );
}

export default App;
