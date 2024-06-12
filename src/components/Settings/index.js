import React from "react";
import CardOption from "./CardOption";

function Settings({ settings, onChange }) {

  const handleOptionClick = (name) => {
    onChange({
      ...settings,
      msgPosition: name
    })
  }

  return (
    <div className="">
      <div className="cardOptions">
        <CardOption 
          selected={settings.msgPosition === "closest"} 
          img={process.env.PUBLIC_URL + "/img/config-closest.png"} 
          name="closest"
          title="Closest"
          onClick={handleOptionClick}
        >
          It will look for the closest message from the same user.
        </CardOption>
        <CardOption
          selected={settings.msgPosition === "after"}
          img={process.env.PUBLIC_URL + "/img/config-after.png"}
          name="after"
          title="After"
          onClick={handleOptionClick}
        >
          It will look for the closest message from the same user <strong>after</strong> the location.
        </CardOption>
        <CardOption
          selected={settings.msgPosition === "before"}
          img={process.env.PUBLIC_URL + "/img/config-before.png"}
          name="before"
          title="Before"
          onClick={handleOptionClick}
        >
          It will look for the closest message from the same user <strong>before</strong> the location.
        </CardOption>
      </div>
    </div>

  );
}

export default Settings;
