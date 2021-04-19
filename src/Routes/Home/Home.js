import React from "react";
import styled from "styled-components";
import useInput from "../../Hooks/useInput";
import { withRouter } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  width: 800px;
  height: 40px;
`;

const Home = ({ history }) => {
  const youtubeURL = useInput("");

  const handleInput = (e) => {
    if (e.code === "Enter") {
      const url = e.target.value.split("/");
      const host = url[2];
      const pathAndQuery = url[3];
      if (host === "www.youtube.com") {
        history.push("/" + pathAndQuery);
      } else if (host === "youtu.be") {
        history.push("/watch?v=" + pathAndQuery);
      }
    }
  };

  return (
    <Wrapper>
      <Input {...youtubeURL} onKeyDown={handleInput} />
    </Wrapper>
  );
};

export default withRouter(Home);
