import React from "react";
import { Helmet } from "react-helmet";

const domain = "http://localhost:9000";

const IndexPage = () => (
  <>
    <Helmet>
      <meta property="og:image" content={domain + "/og-image/index.png"} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:width" content="50" />
    </Helmet>
    Hello World, your image data is stored in the document header.
  </>
);

export default IndexPage;
