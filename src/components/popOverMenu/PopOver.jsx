"use client";
import React from "react";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import styles from "./popover.module.css";
import "@radix-ui/themes/styles.css";
import { X } from "lucide-react";
import { Button } from "../button/Button";
import Link from "next/link";

const PopOver = () => {
  const { openOrCloseAlertDialog, specifyAction, alertAction } =
    useAlertDialogContext();

  const selectionFormActionToPerson = (action) => {
    if (action === "kill") {
      openOrCloseAlertDialog(false);
    } else {
      openOrCloseAlertDialog(true);
      specifyAction(action); // Action can be taken
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleClose}>
        <h1 className={styles.title}>
          {alertAction === "activity"
            ? "Pages to Explore"
            : "Select Post Action to Take"}
        </h1>

        <button>
          <X onClick={() => openOrCloseAlertDialog(false)} />
        </button>
      </div>

      <div className={styles.actionBtns}>
        {alertAction === "activity" ? (
          <>
            <Button onClick={() => selectionFormActionToPerson("kill")}>
              <Link href={"/campaigns"}>Check out Campaigns</Link>
            </Button>
            <Button onClick={() => selectionFormActionToPerson("kill")}>
              <Link href={"/threads"}>Check out Threads</Link>
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => selectionFormActionToPerson("report")}>
              Report A Problem
            </Button>
            <Button onClick={() => selectionFormActionToPerson("thread")}>
              Start a Thread
            </Button>
            <Button onClick={() => selectionFormActionToPerson("campaign")}>
              Start a Campagn
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
export default PopOver;
