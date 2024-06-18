"use client";
import React, { useState } from "react";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { Button } from "../../button/Button";
import { useAlertDialogContext } from "../../../app/store/AlertDialog";
import { useMutation } from "@tanstack/react-query";
import { FormTextField } from "../../form-fields";
import { Spinner } from "@radix-ui/themes";
import styles from "./authentication.module.css";
import { Theme } from "@radix-ui/themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../../../lib/actions";

const FormComponent = () => {
  //const methods = useForm({});
  const methods = useForm();

  const { openOrCloseAlertDialog } = useAlertDialogContext();

  const [formOperationState, setFormOperationState] = useState("sign-up");
  const [errorMessage, setErrorMessage] = useState();

  const {
    mutate,
    data,
    isPending,

    reset,
  } = useMutation({
    mutationFn: (newPost) =>
      fetch(
        formOperationState === "sign-up"
          ? `${baseUrl}api/users`
          : `${baseUrl}api/users/signin`,
        {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(
            formOperationState === "sign-up"
              ? {
                  username: newPost.name,
                  email: newPost.email,
                  password: newPost.password,
                  userType: "user",
                  userBadge: "regular",
                }
              : {
                  email: newPost.email,
                  password: newPost.password,
                }
          ),
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to login. Please check your credentials");
        }
        console.log("successfully login");
        reset();
        return res.json();
      }),
    onSuccess: (data) => {
      // Handle successful login (e.g., save user data to context, redirect, etc.)
      console.log("Successfully logged in:", data);
      if (formOperationState === "sign-up") {
        setFormOperationState("sign-in");
      } else {
        //loggedInUser(data);
        openOrCloseAlertDialog(false);
        window.sessionStorage.setItem("user", JSON.stringify(data));
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      setErrorMessage(error.message);
    },
  });

  /* const onSubmit = (data: CheftLoginOrSignUpType) => {
    mutate(data);
  }; */
  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className={styles.container}>
        <div className={styles.containerItem}>other side</div>
        <div className={styles.containerItem}>
          <CircleX
            className={styles.closebtn}
            onClick={() => openOrCloseAlertDialog(false)}
          />
          <h1>
            {formOperationState === "sign-up"
              ? "Create a new account"
              : "Login in with details"}
          </h1>

          {formOperationState === "sign-up" ? (
            <p>
              Already have an account?{" "}
              <span
                className={styles.pspan}
                onClick={() => setFormOperationState("sign-in")}
              >
                Sign in
              </span>
            </p>
          ) : (
            <p>
              You dont have an account?
              <span
                className={styles.pspan}
                onClick={() => setFormOperationState("sign-up")}
              >
                Sign up
              </span>
            </p>
          )}

          <div className={styles.loginBtns}>
            <GoogleLogin
              className={styles.google}
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse?.credential);
                console.log(decoded);
                openOrCloseAlertDialog(false);
                window.sessionStorage.setItem(
                  "user",
                  JSON.stringify({
                    id: decoded.sub,
                    username: decoded.name,
                    email: decoded.email,
                  })
                );
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className={styles.formItem}>
                {formOperationState === "sign-up" && (
                  <FormTextField
                    name="name"
                    label="Full name"
                    placeholder="Full name"
                    type="text"
                    /*   validateFn={(value) => {
                      if (value.length < 4) {
                        return "Username should contain atleast 5 character(s)";
                      }
                      return;
                    }} */
                  />
                )}
                <FormTextField
                  name="email"
                  label="Email"
                  placeholder="Full name"
                  type="email"
                  /*  validateFn={(value) => {
                    if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                      return "Please provide a valid email eg:boni@gmail.com";
                    }
                    return;
                  }} */
                />{" "}
                <FormTextField
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                />{" "}
                {formOperationState === "sign-up" && (
                  <FormTextField
                    name="confirm password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    type="password"
                  />
                )}
              </div>

              <div>
                <Theme>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Spinner />
                    ) : formOperationState === "sign-up" ? (
                      "Sign up"
                    ) : (
                      "Sign in"
                    )}
                  </Button>{" "}
                </Theme>
              </div>

              <p className="text-pink-500 font-bold">{errorMessage}</p>
            </form>
          </FormProvider>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default FormComponent;
