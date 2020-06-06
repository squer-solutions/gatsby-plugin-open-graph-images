import React from "react";
import OpenGraphImage from "../OpenGraphImage";

export default ({ pageContext, location, ...props }) => (
  <OpenGraphImage {...pageContext.ogImage}>
    <div>Hello world</div>
    <div>
      <i>props: </i>
      {JSON.stringify({ pageContext, location, ...props })}
    </div>
  </OpenGraphImage>
);
