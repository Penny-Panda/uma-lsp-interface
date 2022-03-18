import React from "react";
import { Box } from "@mui/system";
import homeImage from "../images/homeImage.png";
import { Button, Container, Grid, Typography } from "@mui/material";
import { AppContext } from "../contexts/AppContext";

function HomePage({setCurrentTab}:{setCurrentTab: any}) {
    const { userAddress, connectWallet } = React.useContext(AppContext);
    
    return (
        <React.Fragment>
        <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
                m: 0,
                pt: 12
            }}
        >
            <Grid item sx={{ bgcolor: "background.default" }}>
                <Typography variant="h1" gutterBottom fontWeight='500'>
                    Deploy and Distribute
                    <br />
                    UMA LSP tokens
                    <br />
                    using Superfluid's supertokens.
                </Typography>
                <Typography gutterBottom variant="h6">
                    Supported LSP tokens: Range, Success, KPI Options.
                    <br />
                    Supported Networks: Mainnet, Kovan, Polygon, Mumbai.
                </Typography>
                
                <Box sx={{my: 5}}>
                    {userAddress?
                        (
                            <Box>
                                <Button sx={{mr: 4, py: 2, width: '15em'}} variant="contained" onClick={() => setCurrentTab(1)}>
                                    Launch
                                </Button>
                                <Button sx={{mr: 4, p: 2, width: '15em'}} variant="contained" onClick={() => setCurrentTab(2)}>
                                    Distrubute
                                </Button>
                            </Box>
                        ):(
                        <Button sx={{mr: 4, p: 2, width: '15em'}} variant="contained" onClick={() => connectWallet()}>
                            Connect wallet
                        </Button>
                    )}
                </Box>
            </Grid>
            <Grid
            item
            sx={{
                width: "207px",
                height: "254px",
                backgroundColor: "#473f51",
                padding: "48px",
            }}
            >
            <Box src={homeImage} component="img" />
            </Grid>
        </Grid>
        </React.Fragment>
    );
}

export default HomePage;
