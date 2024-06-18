"use client";
import React from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../button/Button";
import { FormTextArea } from "../../form-fields/TextArea";
import { useAlertDialogContext } from "../../../app/store/AlertDialog";
import { Spinner, Theme } from "@radix-ui/themes";
import styles from "./comment.module.css";
import ToastDemo from "../../toast/Toast";
import "@radix-ui/themes/styles.css";
import { X } from "lucide-react";
import { baseUrl } from "../../../lib/actions";

const CommentForm = () => {
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
      fetch(`${baseUrl}api/comment`, {
        // Using relative path to access API route
        method: "POST",
        body: JSON.stringify({
          comment: data.message,
          reportId: complaintReportId.id,
          reporterId: user.id,
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
      fireToast(3000, "Comment submitted");
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
          <h1 className={styles.title}>Comment</h1>

          <button>
            <X onClick={() => openOrCloseAlertDialog(false)} />
          </button>
        </div>
        <form onSubmit={methods.handleSubmit(onSubmitNewComplaint)}>
          <FormTextArea
            name="message"
            label="Comment"
            validateFn={(value) => {
              if (value.length < 1) {
                return "Comment should be atleast one word";
              }
              return;
            }}
          />

          <Theme>
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner /> : "Post Comment"}
            </Button>
          </Theme>
        </form>
      </div>
    </FormProvider>
  );
};
export default CommentForm;
