import React from "react";

function DownloadButton({ data, filename }) {

  const createDownloadLink = (data) => (
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
  )

  return (
    <a className="primaryButton" href={createDownloadLink(data)} download={`${filename}.geojson`}>Download</a>
  );
}

export default DownloadButton;
