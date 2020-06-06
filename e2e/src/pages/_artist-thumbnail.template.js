import React from "react";
import { graphql } from "gatsby";

export default (props) => (
  <>
    <div>Thumbnail for {props.data.artistsJson.name}</div>
  </>
);

export const pageQuery = graphql`
  query($id: String!) {
    artistsJson(id: { eq: $id }) {
      name
    }
  }
`;
