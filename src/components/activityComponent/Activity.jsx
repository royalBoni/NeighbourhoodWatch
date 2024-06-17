"use client";

import React from "react";
import styles from "./activity.module.css";
import { LayoutList } from "lucide-react";
import { useAlertDialogContext } from "../../app/store/AlertDialog";

const Activity = () => {
  const { openOrCloseAlertDialog, specifyAction } = useAlertDialogContext();
  const setOperations = (operationId) => {
    openOrCloseAlertDialog(true);
    specifyAction(operationId);
  };
  return (
    <div onClick={() => setOperations("activity")} className={styles.container}>
      <LayoutList />
    </div>
  );
};

export default Activity;
