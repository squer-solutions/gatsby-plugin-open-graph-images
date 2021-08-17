import * as React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

const domain = "http://localhost:9000";

const ArtistPage = ({ data, pageContext }) => {
  return (
    <>
      <Helmet>
        <meta property="og:image" content={domain + pageContext.ogImage.path}/>
        <meta property="og:image:width" content={pageContext.ogImage.size.width}/>
        <meta property="og:image:height" content={pageContext.ogImage.size.height}/>
      </Helmet>
      ...
    </>
  );
};

export const query = graphql`
  query ArtistQuery {
    artistsJson(id: {eq: "jc"}) {
      name
    }
  }
`;
export default ArtistPage;
