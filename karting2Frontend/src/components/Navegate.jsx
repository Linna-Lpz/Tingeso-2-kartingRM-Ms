import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function Navegate() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%" }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            padding: "8px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ 
              fontSize: "1rem",
              fontWeight: "medium"
            }}
          >
            Inicio
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              letterSpacing: "1px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Karting RM
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/clientRegister")}
              sx={{ 
                fontSize: "1rem",
                fontWeight: "medium"
              }}
            >
              Registro
            </Button>

            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/reports")}
              sx={{ 
                fontSize: "1rem",
                fontWeight: "medium"
              }}
            >
              Gestión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
