import * as React from "react";
import { styled } from "@mui/system";

const StyledContainerBase = ({ children, ...props }) => {
  return (
    <div className="sb-nav-fixed">
      <div id="layoutSidenav">
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <div maxWidth="md" {...props}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const BasicBoard = styled(StyledContainerBase)`
  width: 100%;
  maxheight: auto;
`;

export default BasicBoard;
