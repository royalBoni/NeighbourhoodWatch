"use client";
import React, { useState, ChangeEvent } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../button/Button";
import { FormTextArea } from "../../form-fields/TextArea";
import { useAlertDialogContext } from "../../../app/store/AlertDialog";
import { Spinner, Theme } from "@radix-ui/themes";
import styles from "./complaint.module.css";
import ToastDemo from "../../toast/Toast";
import "@radix-ui/themes/styles.css";
import { X } from "lucide-react";
import { baseUrl } from "../../../lib/actions";

const ComplaintForm = () => {
  const fireToast = (duration, message) => {
    specifyToastMessage(message);
    specifyToastState(true);

    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      specifyToastState(false);
    }, duration);
  };
  const storedUserData = sessionStorage.getItem("user");
  const user = storedUserData ? JSON.parse(storedUserData) : null;

  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);
  const { toastState, toastMessage, complaintReportId } =
    useAlertDialogContext();

  const { openOrCloseAlertDialog, specifyToastState, specifyToastMessage } =
    useAlertDialogContext();
  const methods = useForm();

  const onSubmitNewComplaint = (data) => {
    mutate(data);

    /* console.log(data.message);
    console.log(complaintReportId);
    console.log(user.username);
    console.log(user.id); */
  };

  const { mutate, reset, isPending } = useMutation({
    mutationFn: (data) =>
      fetch(`${baseUrl}api/complain`, {
        // Using relative path to access API route
        method: "POST",
        body: JSON.stringify({
          complaintMessage: data.message,
          reportId: complaintReportId.id,
          complainantId: user?.id,
          complainantEmail: user?.email,
          complainantName: user?.username,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to create complaint. Please check your inputs"
          );
        }
        console.log("successfully created");
        reset();
        return res.json();
      }),
    onSuccess: (data) => {
      // Handle successful login (e.g., save user data to context, redirect, etc.)
      console.log("Successfully created");
      fireToast(3000, "Complaint have been submitted");
      openOrCloseAlertDialog(false);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  return (
    <FormProvider {...methods}>
      <ToastDemo />
      <div className={styles.container}>
        <div className={styles.titleClose}>
          <h1 className={styles.title}>Formal Complaint</h1>

          <button>
            <X onClick={() => openOrCloseAlertDialog(false)} />
          </button>
        </div>
        <form onSubmit={methods.handleSubmit(onSubmitNewComplaint)}>
          <FormTextArea
            name="message"
            label="Message"
            validateFn={(value) => {
              if (value.split(" ").length < 5) {
                return "Message should be more than 5 words";
              }
              return;
            }}
          />

          <Theme>
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner /> : "Create Complaint"}
            </Button>
          </Theme>
        </form>
      </div>
    </FormProvider>
  );
};
export default ComplaintForm;
