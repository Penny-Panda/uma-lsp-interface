import React from "react";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useTheme from "@mui/material/styles/useTheme";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";

import { AppContext } from "../contexts/AppContext";
import { ColorModeContext } from "../contexts/ColorModeContext";
import { chains } from "../helpers/constants";
import { truncateAddress } from "../helpers/utils";

const Header = ({setCurrentTab}:{setCurrentTab: any}) => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const { userAddress, chainId, changeChain, connectWallet } = React.useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography onClick={() => setCurrentTab(0)} variant="h3" sx={{fontWeight: 500, cursor:'pointer'}} component="div" >
          UMA LSP Interface
        </Typography>
        <Box display="flex">
          <IconButton
            sx={{mr: 1}}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          <Box sx={{mx: 1}} justifyContent="center">
            <Button 
              id="links-button"
              aria-controls={open ? 'links-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              Links
            </Button>
            <Menu
              id="links-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'links-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Link underline="hover" color="#FFF" href="https://umaproject.org" target="_blank">
                <MenuItem onClick={handleClose}>
                    UMA Project
                </MenuItem>
              </Link>
              <Link underline="hover" color="#FFF" href="https://www.superfluid.finance" target="_blank">
                <MenuItem onClick={handleClose}>
                    Superfluid
                </MenuItem>
              </Link>
              <Link underline="hover" color="#FFF" href="https://docs.umaproject.org/uma-tokenholders/approved-price-identifiers" target="_blank">
                <MenuItem onClick={handleClose}>
                    Approved Price Identifiers
                </MenuItem>
              </Link>
              <Link underline="hover" color="#FFF" href="https://docs.umaproject.org/uma-tokenholders/approved-collateral-currencies" target="_blank">
                <MenuItem onClick={handleClose}>
                    Approved Collateral Tokens
                </MenuItem>
              </Link>
              <Link underline="hover" color="#FFF" href="https://docs.umaproject.org/kpi-options/kpi-price-identifier" target="_blank">
                <MenuItem onClick={handleClose}>
                    Using General_KPI Price Identifier and Ancillary Data Parameters
                </MenuItem>
              </Link>
              <Link underline="hover" color="#FFF" href="https://github.com/radchukd/uma-lsp-interface" target="_blank">
                <MenuItem onClick={handleClose}>
                    Github Repository
                </MenuItem>
              </Link>
            </Menu>
          </Box>
          <Box sx={{mx: 1}} justifyContent="center">
            <Button>Get Help</Button>
          </Box>
          <Box display="flex" sx={{mx: 1}} justifyContent="center">
            {userAddress ? (
              <Tooltip title="Click to copy">
                <Button onClick={() => {navigator.clipboard.writeText(userAddress)}} variant="contained">{truncateAddress(userAddress)}</Button>
              </Tooltip>
            ) : (
                <Button variant="contained" onClick={() => connectWallet()}>
                  Connect wallet
                </Button>
            )}
          </Box>
          {userAddress && chainId && (
            <React.Fragment>
              {!chains.some((c) => c.id === chainId) ? (
                <Tooltip
                  title={`Supported networks: ${chains
                    .map((chain) => chain.name)
                    .toString()}`}
                >
                  <Button variant="contained" onClick={() => changeChain(1)}>
                    Unsupported network
                  </Button>
                </Tooltip>
              ) : (
                <FormControl sx={{ml: 1}}>
                  <InputLabel id="chain-select-label">Chain</InputLabel>
                  <Select
                    labelId="chain-select-label"
                    id="chain-select"
                    size="small"
                    value={chainId}
                    label="Chain"
                    onChange={(e) => changeChain(Number(e.target.value))}
                  >
                    {chains.map((chain) => (
                      <MenuItem dense key={chain.id} value={chain.id}>
                        {chain.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </React.Fragment>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
    </React.Fragment>
  );
};

export default Header;
