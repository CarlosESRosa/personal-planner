import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  CssBaseline,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";

// 1. Tema MUI com a mesma paleta do Tailwind
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FFBA08", dark: "#E0A200" },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#161616",
      secondary: "#323232"
    },
    success: { main: "#2AA84F" },
    warning: { main: "#F79009" },
    error: { main: "#E53935" }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 2. Faz o MUI injetar os estilos ANTES do Tailwind */}
    <StyledEngineProvider injectFirst>
      {/* 3. Deixa todo o app ciente do tema */}
      <ThemeProvider theme={theme}>
        {/* 4. Reset CSS nativo + tipografia consistente */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
