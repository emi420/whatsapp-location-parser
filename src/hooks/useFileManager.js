import { useState } from 'react';

function useFileManager() {

    const [dataFiles, setDataFiles] = useState({});
    const [content, setContent] = useState(null);

    const handleFile = (fileContent) => {
        setContent(fileContent)
    }
    const handleDataFile = (filename, fileContent) => {
        setDataFiles(prevData => ({
            ...prevData,
            [filename]: fileContent
        }));
    }

    const resetFileManager = () => {
        setContent(null);
        setDataFiles({});
    }

    return [handleFile, handleDataFile, resetFileManager, dataFiles, content];

}

export default useFileManager;
