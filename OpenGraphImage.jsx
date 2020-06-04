import React from "react";
import { Helmet } from "react-helmet";

const OpenGraphImage = ({ children, thumbnail }) => {
  return thumbnail ? (
    <>
      <Helmet>
        {thumbnail.path && <meta property="og:image" content={thumbnail.path} />}
        {thumbnail.path && <meta name="twitter:image" content={thumbnail.path} />}
        {thumbnail.size && thumbnail.size.width && <meta property="og:image:width" content={thumbnail.size.width} />}
        {thumbnail.size && thumbnail.size.height && <meta property="og:image:height" content={thumbnail.size.height} />}
      </Helmet>
      {children}
    </>
  ) : (
    children
  );
};

export default OpenGraphImage;
