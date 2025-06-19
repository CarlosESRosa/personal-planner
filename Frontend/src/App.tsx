import React from "react";
import { Button, Card, CardContent } from "@mui/material";

const swatches = [
  { name: "primary", className: "bg-primary" },
  { name: "primary-dark", className: "bg-primary-dark" },
  { name: "accent", className: "bg-accent text-white" },
  { name: "accent-light", className: "bg-accent-light text-white" },
  { name: "bg", className: "bg-bg" },
  { name: "surface", className: "bg-surface" },
  { name: "success", className: "bg-success text-white" },
  { name: "warning", className: "bg-warning text-white" },
  { name: "error", className: "bg-error text-white" },
];

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg p-6">
      <h1 className="text-4xl font-extrabold text-primary">
        Paleta personalizada ✔️
      </h1>

      {/* grade com as amostras */}
      <div className="grid gap-4 sm:grid-cols-3">
        {swatches.map(({ name, className }) => (
          <div
            key={name}
            className={`${className} flex h-20 w-36 items-center justify-center rounded-md shadow`}
          >
            <span className="text-sm font-semibold">
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* botão MUI deve vir na cor primária automaticamente */}
      <Card className="mt-6 shadow-lg">
        <CardContent className="flex flex-col items-center gap-4">
          <p>Botão Material UI consumindo `theme.palette.primary`:</p>
          <Button variant="contained">Confirmar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
