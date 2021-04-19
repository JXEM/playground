import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  background-color: yellow;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeftThumb = styled.div``;

const RightThumb = styled.div``;

const Range = styled.div`
  width: 100%;
  height: 20px;
  background-color: green;
`;

const Slider = () => {
  const min = 0;
  const max = 10000;

  return <Wrapper></Wrapper>;
};

export default Slider;
