import * as React from "react";
import { graphql } from "gatsby";

const ArtistPage = ({ data }) => {
  return (
    <div>
      Thumbnail for: {data.artistsJson.name}
    </div>
  );
};

export const query = graphql`
  query ArtistQueryThumbnail($id: String) {
    artistsJson(id: {eq: $id}) {
      name
    }
  }
`;
export default ArtistPage;
