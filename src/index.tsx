import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MaintenancePage } from "./screens/MaintenancePage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <MaintenancePage />
  </StrictMode>,
);
