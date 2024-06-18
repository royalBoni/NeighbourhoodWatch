"use client";
import React, { useState, ChangeEvent } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../button/Button";
import { ImagePlus, X } from "lucide-react";
import { FormTextArea } from "../form-fields/TextArea";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import { Spinner, Theme } from "@radix-ui/themes";
import Image from "next/image";
import styles from "./createReport.module.css";
import { Trash2, Ambulance, TrafficCone, Home, BusFront } from "lucide-react";
import ToastDemo from "../toast/Toast";
import { FormTextField } from "../form-fields";
import { baseUrl } from "../../lib/actions";
import "@radix-ui/themes/styles.css";

import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

const allCategories = ["Sanitation", "Road", "Health", "Residential"];

const CreateReportForm = () => {
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
  const { alertAction } = useAlertDialogContext();

  const { openOrCloseAlertDialog, specifyToastState, specifyToastMessage } =
    useAlertDialogContext();
  const methods = useForm();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState();
  const [location, setLocation] = useState();

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "es", // Default region for responses.
  });
  /* 
  if ("geolocation" in navigator) {
    console.log("Geolocation is Available");
  } else {
    console.log("Geolocation is NOT Available");
  }
 */
  function success(position) {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }

  navigator.geolocation.getCurrentPosition(success);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    const fileInput = document.getElementById("images");
    if (fileInput) {
      fileInput.click(); // Programmatically trigger file input click
    }
  };

  const deleteSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmitNewGift = (data) => {
    if (!imageFile) {
      fireToast(5000, "Please provide an image");
    } else if (!location) {
      fireToast(5000, "Please enable location");
    } else if (!category) {
      fireToast(5000, "Please select one category");
    } else {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
      formData.append("description", data.description);
      formData.append("subscribeEmailStatus", data.subscribeEmailStatus);
      formData.append("userId", user?.id);
      formData.append("username", user?.username);
      formData.append("email", user?.email);
      formData.append("img", imageFile);
      formData.append("numberOfPeopleNeeded", data.numberOfPeopleNeeded);
      formData.append("skillSet", data.Skillset);

      mutate(formData);
      /* console.log(formData);
      console.log(category);
      console.log(location);
      console.log(data.description);
      console.log(imageFile);
      console.log(user?.id);
      console.log(data.subscribeEmailStatus); */
    }
  };

  const { mutate, reset, isPending } = useMutation({
    mutationFn: (formData) =>
      fetch(
        alertAction === "thread"
          ? `${baseUrl}api/thread`
          : alertAction === "report"
          ? `${baseUrl}api/reports`
          : `${baseUrl}api/campaign`,
        {
          // Using relative path to access API route
          method: "POST",
          body: formData,
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create . Please check your inputs");
        }
        console.log("successfully created");
        reset();
        return res.json();
      }),
    onSuccess: (data) => {
      // Handle successful login (e.g., save user data to context, redirect, etc.)
      console.log("Successfully submitted:", data);
      fireToast(3000, "Submitted Successfully");
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
          <h1 className={styles.title}>
            {alertAction === "report"
              ? "Create a Report"
              : alertAction === "thread"
              ? "Create a Thread"
              : "Start a Campaign"}
          </h1>

          <button>
            <X onClick={() => openOrCloseAlertDialog(false)} />
          </button>
        </div>
        <form onSubmit={methods.handleSubmit(onSubmitNewGift)}>
          <FormTextArea
            name="description"
            label="Description"
            validateFn={(value) => {
              if (value.split(" ").length < 5) {
                return "Description should be more than 5 words";
              }
              return;
            }}
          />
          {/* Input field for uploading images */}
          <div>
            <label htmlFor="images">Image:</label>
            {!imagePreview && (
              <>
                <div
                  className={styles.inputImage}
                  onClick={handleIconClick} // Call handleIconClick function when icon is clicked
                >
                  Click to Add Image
                  <ImagePlus size={50} />
                </div>
                <input
                  className="w-fit h-fit"
                  hidden
                  id="images"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange} // Handle image selection
                />
              </>
            )}
          </div>
          {/* Display image preview */}
          {imagePreview && (
            <div className={styles.previewImage}>
              <Button className={styles.previewDeleteBtn}>
                <X onClick={deleteSelectedImage} />
              </Button>
              <Image
                src={imagePreview}
                alt="Preview"
                className={styles.image}
                width={50}
                height={50}
              />
            </div>
          )}

          {alertAction === "campaign" && (
            <>
              <FormTextArea
                name="Skillset"
                label="Skillset Needed"
                /*  validateFn={(value) => {
              if (value.split(" ").length < 1) {
                return "Please provide a skillset needed or just input Any";
              }
              return;
            }} */
              />

              <FormTextField
                name="numberOfPeopleNeeded"
                label="Number of People Needed"
                type="number"
              />
            </>
          )}

          <div>
            <label htmlFor="images">Category</label>
            <div className={styles.categories}>
              {allCategories.map((item) => (
                <div
                  className={
                    item === category ? styles.activeCategory : styles.category
                  }
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  <>
                    {item === "Sanitation" ? (
                      <Trash2 fill="black" />
                    ) : item === "Health" ? (
                      <Ambulance fill="red" />
                    ) : item === "Transportation" ? (
                      <BusFront />
                    ) : item === "Road" ? (
                      <TrafficCone fill="orange" />
                    ) : (
                      <Home fill="green" />
                    )}
                  </>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {alertAction !== "thread" && (
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                placeholder="January"
                {...methods.register("subscribeEmailStatus")}
                className={styles.checkbox}
              />
              <label htmlFor="">
                I want to be informed through email when there is a status
                change
              </label>
            </div>
          )}

          <Theme>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <Spinner />
              ) : alertAction === "report" ? (
                "Submit Report"
              ) : alertAction === "thread" ? (
                "Submit Thread"
              ) : (
                "Submit Campaign"
              )}
            </Button>
          </Theme>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateReportForm;
