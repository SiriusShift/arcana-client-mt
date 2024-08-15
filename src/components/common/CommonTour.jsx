import Tour from "reactour";

function CommonTour({ open, onClose, steps }) {
  return <Tour isOpen={open} steps={steps} onRequestClose={onClose} />;
}

export default CommonTour;
