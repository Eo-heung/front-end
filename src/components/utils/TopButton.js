import React from "react";
import { Fab, useScrollTrigger } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import styled from "styled-components";

const PositionContainer = styled.div`
  position: fixed;
  width: 100%;
  left: 90%;
  bottom: 100px;
  z-index: 1000;
`;

const ScrollToTopButton = styled(Fab)`
  position: absolute;
  top: 0;
  border: none;
  background-color: transparent;
  z-index: 1001;
`;

function TopButton() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  console.log("Trigger:", trigger);

  return (
    trigger && (
      <PositionContainer>
        <ScrollToTopButton
          style={{ backgroundColor: "#FCBE71", color: "#fff" }}
          size="large"
          onClick={scrollToTop}
        >
          <ArrowUpwardIcon />
        </ScrollToTopButton>
      </PositionContainer>
    )
  );
}


export default TopButton;
