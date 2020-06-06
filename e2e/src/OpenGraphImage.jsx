import React from "react";
import { Helmet } from "react-helmet";

const OpenGraphImage = ({ children, path, size }) => {
  if (!path) {
    console.warn(`🖼 Used OpenGraph Image without path. OpenGraph Image is not included in page-header.`);
    return <>{children}</>;
  }

  return (
    <>
      <Helmet>
        <meta property="og:image" content={path} />
        <meta name="twitter:image" content={path} />
        {size && size.width && <meta property="og:image:width" content={size.width} />}
        {size && size.height && <meta property="og:image:height" content={size.height} />}
      </Helmet>
      {children}
    </>
  );
};

export default OpenGraphImage;
