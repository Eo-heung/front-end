import * as React from 'react';
import { styled } from '@mui/system';

const StyledContainerBase = ({ children, ...props }) => {
  return (
    <div className="sb-nav-fixed mainpage">
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1.5rem;
  max-width: 1200px;
  box-sizing: border-box;
  text-align: left;
`;

export default BasicBoard;