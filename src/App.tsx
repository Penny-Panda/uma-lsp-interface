import React from "react";

// import useTheme from "@mui/material/styles/useTheme";
// import useMediaQuery from "@mui/material/useMediaQuery";

import DistributeTab from "./components/DistributeTab";
import Header from "./components/Header";
import LaunchTab from "./components/LaunchTab";
import HomePage from "./components/HomePage";

const tabs = ["Launch", "Distribute"];

function App() {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTab, setCurrentTab] = React.useState(0);

  React.useEffect(() => {
    const tabIndex = tabs.indexOf(window.location.hash.slice(1));
    setCurrentTab(tabIndex > -1 ? tabIndex : 0);
  }, []);

  // const onTabChange = (
  //   _: React.SyntheticEvent<Element, Event>,
  //   newValue: number,
  // ) => {
  //   setCurrentTab(newValue);
  //   window.location.hash = `#${tabs[newValue]}`;
  // };

  // const tabBorder = !isMobile
  //   ? `0.5px solid ${theme.palette.divider}`
  //   : undefined;

  return (
    <React.Fragment>
      <Header setCurrentTab={setCurrentTab} />
      {(currentTab === 0)?
        <HomePage setCurrentTab={setCurrentTab} />:
        (
          (currentTab === 1)?
          <LaunchTab />:
          <DistributeTab />
        )
      }
    </React.Fragment>
  );
}

export default App;
