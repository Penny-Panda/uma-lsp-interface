import React from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import { AppContext } from "../contexts/AppContext";

const AppLayout: React.FC = ({ children }) => {
  const { isLoading } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" style={{maxWidth: 'inherit'}} sx={{ mb: 4, mt: 1 }}>
        <Container
          style={{maxWidth: 'inherit'}} 
          sx={{ p: { xs: 4, md: 6 }}}
        >
          <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
          {children}
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default AppLayout;
