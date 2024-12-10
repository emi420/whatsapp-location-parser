import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import JSZip from "jszip";
import { useIntl } from 'react-intl';

const fileTypes = ["txt", "zip"];

function FileUpload({ onFilesLoad, onDataFileLoad, onError}) {
  const [files, setFiles] = useState();
  const [dataFiles, setDataFiles] = useState();
  const [filesCount, setFilesCount] = useState();
  const intl = useIntl();

  const handleChange = (loadedFiles) => {
    setFilesCount(loadedFiles.length);
    for (let i = 0; i < loadedFiles.length; i++) {
      const file = loadedFiles[i];
      // Read a .txt export
      if (file.name.toLowerCase().endsWith(".txt")) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
          setFiles(prevFiles => (
            {...prevFiles, ...{[file.name]: evt.target.result}}
          ));  
        }
        reader.onerror = function (evt) {
          onError(file.name);
        }
      } else {
        // File is a Zip
        new JSZip().loadAsync( file )
        .then(function(zip) {
          Object.keys(zip.files).forEach(filename => {
            if (filename.toLowerCase().endsWith(".txt")) {
              zip.files[filename].async("string").then(function (data) {
                setFiles(prevFiles => (
                  {...prevFiles, ...{[file.name]: data}}
                ));  
              });
            } else if (filename.toLowerCase().endsWith(".jpg") ||
                filename.toLowerCase().endsWith(".mp4")) {
              zip.files[filename].async("arraybuffer").then(function (data) {
                const buffer = new Uint8Array(data);
                const blob = new Blob([buffer.buffer]);
                onDataFileLoad(filename, blob)
              });
            }
          })
        });
      }
    };
  };

  useEffect(() => {
    if (files && Object.keys(files).length === filesCount) {
      onFilesLoad(files);
    }
  }, [files, onFilesLoad]);

  return (
    <FileUploader
      classes={"fileUploadDropArea"}
      handleChange={handleChange}
      multiple
      name="file"
      types={fileTypes}
      label={intl.formatMessage({id: "app.uploadLabel", defaultMessage: "Upload or drag a file right here"})}
    />
  );
}

export default FileUpload;
