import React from "react";

import { VoidConfirmContext } from "../context/VoidConfirmContext";

const useVoidConfirm = () => {
  const reason = React.useContext(VoidConfirmContext);

  return reason;
};

export default useVoidConfirm;
