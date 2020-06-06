import React from "react";
import OpenGraphImage from "../OpenGraphImage";

const IndexPage = () => (
  <OpenGraphImage path={"http://localhost:9000/og-image/index.png"} size={{ width: 400, height: 50 }}>
    <div>Root Page</div>
  </OpenGraphImage>
);

export default IndexPage;
