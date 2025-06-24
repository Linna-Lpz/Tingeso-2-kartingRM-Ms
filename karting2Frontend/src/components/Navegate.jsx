import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";

export default function Navegate() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%" }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            padding: "8px 16px",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              mr: 4,
            }}
          >
            KartingRM
          </Typography>

          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ mx: 1 }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={() => navigate("/clientRegister")}
            sx={{ mx: 1 }}
          >
            Registro de usuario
          </Button>
          <Button
            color="inherit"
            startIcon={<MoreVertIcon />}
            onClick={handleMenuOpen}
            sx={{ mx: 1 }}
          >
            Más opciones
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                navigate("/statusKartBooking");
                handleMenuClose();
              }}
            >
              <CollectionsBookmarkOutlinedIcon sx={{ mr: 1 }} />
              Reservas del cliente
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/RackWeekly");
                handleMenuClose();
              }}
            >
              <EventOutlinedIcon sx={{ mr: 1 }} />
              Reservas semanales
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/Reports");
                handleMenuClose();
              }}
            >
              <EventOutlinedIcon sx={{ mr: 1 }} />
              Reportes de venta
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
