import "./App.css";
import "./assets/styles/common.styles.scss";
import { theme } from "./theme/theme";
import { router } from "./navigation/router";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { AppProvider } from "./context/AppContext";
import { AttachmentsProvider } from "./context/AttachmentsContext";
import { DirectReleaseProvider } from "./context/DirectReleaseContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { ReasonConfirmProvider } from "./context/ReasonConfirmContext";
import { VoidConfirmProvider } from "./context/VoidConfirmContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <ConfirmProvider>
          <VoidConfirmProvider>
            <ReasonConfirmProvider>
              <AttachmentsProvider>
                <DirectReleaseProvider>
                  <RouterProvider router={router} />
                </DirectReleaseProvider>
              </AttachmentsProvider>
            </ReasonConfirmProvider>
          </VoidConfirmProvider>
        </ConfirmProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
