import React from "react";
import CardOption from "./CardOption";

function Settings({ onChange }) {

  return (
    <div className="">
      <div class="cardOptions">
        <CardOption img={process.env.PUBLIC_URL + "/img/config-mixed.png"} name="mixed" title="Mixed">
          It will look for the closest message from the same user.
        </CardOption>
        <CardOption img={process.env.PUBLIC_URL + "/img/config-after.png"} name="after" title="After">
          It will look for the closest message from the same user <strong>after</strong> the location.
        </CardOption>
        <CardOption img={process.env.PUBLIC_URL + "/img/config-before.png"} name="before" title="Before">
          It will look for the closest message from the same user <strong>before</strong> the location.
        </CardOption>
      </div>
    </div>

  );
}

export default Settings;
