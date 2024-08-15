import { createContext, useState } from "react";
import useDisclosure from "../hooks/useDisclosure";
import Tour from "reactour";
import { useLocation } from "react-router-dom";
import tourSteps from "../utils/TourSteps";
import useSnackbar from "../hooks/useSnackbar";
import { useTheme } from "@mui/material";

const TourContext = createContext();

const TourProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [steps, setSteps] = useState([]);
  const location = useLocation();
  const snackbar = useSnackbar();
  const theme = useTheme();

  // Function to determine steps based on current location
  const determineSteps = (pathname) => {
    let steps = [];

    if (tourSteps[pathname]) {
      steps = tourSteps[pathname];
    } else {
      steps = [];
    }

    return steps;
  };

  // Function to filter out steps with invalid selectors
  const getValidatedSteps = () => {
    return steps.filter((step) => {
      const element = document.querySelector(step.selector);
      return !!element; // Filter out steps where selector does not find an element
    });
  };

  // Update steps with validated ones
  const validatedSteps = getValidatedSteps();

  // Function to start the tour with appropriate steps
  const startTour = () => {
    const currentSteps = determineSteps(location.pathname);

    if (currentSteps.length === 0) {
      return snackbar({
        variant: "error",
        message: "No tour steps available for this page.",
      });
    }

    setSteps(currentSteps);
    onOpen();
  };

  // Function to handle closing the tour
  const handleCloseTour = () => {
    setSteps([]); // Reset steps when tour is closed
    onClose();
  };

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      <Tour
        steps={validatedSteps}
        isOpen={isOpen}
        onRequestClose={handleCloseTour}
        accentColor={theme.palette.primary.main}
        startAt={0}
        rounded={5}
        className="tourHelper"
      />
    </TourContext.Provider>
  );
};

export { TourContext, TourProvider };
