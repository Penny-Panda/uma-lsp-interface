import React from "react";
import { Box } from "@mui/system";
import homeImage from "../images/homeImage.png";
import { Button, Grid, Typography } from "@mui/material";
import { AppContext } from "../contexts/AppContext";


const HomePage = ({setCurrentTab}:{setCurrentTab: any}) => {
    const { userAddress, connectWallet } = React.useContext(AppContext);
    
    return (
        <React.Fragment>
        <Grid
            container
            alignItems="center"
            sx={{ m: 0, pt: { sm: 8, lg: 12}, justifyContent: {sm: 'space-around', md: 'space-between'} }}
        >
            <Grid item sx={{ bgcolor: "background.default" }}>
                <Typography gutterBottom fontWeight='500' sx={{fontSize: ['2em', '3em', '4em']}}>
                    Deploy and Distribute
                    <br />
                    UMA LSP tokens
                    <br />
                    using Superfluid's supertokens.
                </Typography>
                <Typography gutterBottom  sx={{fontSize: ['0.7em', '1em', '1.2em']}}>
                    Supported LSP tokens: Range, Success, KPI Options.
                    <br />
                    Supported Networks: Mainnet, Kovan, Polygon, Mumbai.
                </Typography>
                
                <Box sx={{my: 4}}>
                    {userAddress?
                        (
                            <Box>
                                <Button sx={{mr: 4, mt: 3, py: 2, width: '15em'}} variant="contained" onClick={() => setCurrentTab(1)}>
                                    Launch
                                </Button>
                                <Button sx={{mr: 4, mt:3, py: 2, width: '15em'}} variant="contained" onClick={() => setCurrentTab(2)}>
                                    Distrubute
                                </Button>
                            </Box>
                        ):(
                        <Button sx={{mr: 4, mt:3, py: 2, width: '15em'}} variant="contained" onClick={() => connectWallet()}>
                            Connect wallet
                        </Button>
                    )}
                </Box>
            </Grid>
            <Grid
            item
            sx={{
                display: ['none', 'npne', 'none', 'none', 'block'],
                width: "207px",
                height: "254px",
                backgroundColor: "#473f51",
                padding: "48px",
                mx: 8
            }}
            >
            <Box src={homeImage} component="img" />
            </Grid>
        </Grid>
        </React.Fragment>
    );
}

export default HomePage;
