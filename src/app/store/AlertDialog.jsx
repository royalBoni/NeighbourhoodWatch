"use client";
import React, { createContext, useContext, useState } from "react";
const AlertDialogContext = createContext(undefined);

export const useAlertDialogContext = () => {
  // Changed from UseAlertDialogContext to useAlertDialogContext (convention)
  const context = useContext(AlertDialogContext);

  if (!context) {
    throw new Error(
      "useAlertDialogContext must be used within an AlertDialogProvider"
    );
  }

  return context;
};

export const AlertDialogProvider = ({ children }) => {
  // Changed from UserProvider to AlertDialogProvider
  const [alertDialog, setAlertDialog] = useState(false); // Renamed accordionState to accordion
  const [alertAction, setAlertAction] = useState(false);
  const [toastState, setToastState] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [complaintReportId, setComplaintReportId] = useState();

  const openOrCloseAlertDialog = (state) => {
    setAlertDialog(state);
  };

  const specifyReportId = (id) => {
    setComplaintReportId(id);
  };

  const specifyAction = (state) => {
    setAlertAction(state);
  };

  const specifyToastState = (state) => {
    setToastState(state);
  };

  const specifyToastMessage = (state) => {
    setToastMessage(state);
  };

  return (
    <AlertDialogContext.Provider
      value={{
        alertDialog,
        openOrCloseAlertDialog,
        alertAction,
        specifyAction,
        toastState,
        specifyToastState,
        toastMessage,
        specifyToastMessage,
        complaintReportId,
        specifyReportId,
      }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
};
