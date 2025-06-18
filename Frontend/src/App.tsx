import React from "react";
import { Button } from "@mui/material";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-4 text-4xl font-extrabold text-primary">
          Tailwind + React + MUI
        </h1>

        <p className="text-gray-700">
          Se você vê esta caixa estilizada, o Tailwind está funcionando&nbsp;🎉
        </p>

        <Button variant="contained" className="mt-6">
          Botão MUI
        </Button>
      </div>
    </div>
  );
}

export default App;
