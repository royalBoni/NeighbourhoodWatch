"use client";
import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import styles from "./alert.module.css";
import FormComponent from "../forms/authentication/AuthenticationForm";
import CreateReportForm from "../createReportForm/CreateReportForm";
import ComplaintForm from "../../components/forms/formalComplaints/ComplaintForm";
import ShareComponent from "../../components/forms/share/Share";
import CommentForm from "../../components/forms/comment/CommentForm";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { setDefaults, geocode, RequestType } from "react-geocode";
import { X } from "lucide-react";
import PopOver from "../popOverMenu/PopOver";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: -3.745,
  lng: -38.523,
};

const defaultMapOptions = {
  //zoomControl: true,
  //tilt: 0,
  //gestureHandling: "auto",
  mapTypeId: "satellite",
};

const AlertDialogComponent = () => {
  const {
    alertDialog,
    openOrCloseAlertDialog,
    alertAction,
    complaintReportId,
  } = useAlertDialogContext();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  const returnLocationFromCordinates = () => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
    });
  };

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (complaintReportId) {
    returnLocationFromCordinates(
      complaintReportId.latitude,
      complaintReportId.longitude
    );
  }

  const center = React.useMemo(() => {
    if (complaintReportId) {
      return {
        lat: Number(complaintReportId?.latitude),
        lng: Number(complaintReportId?.longitude),
      };
    } else {
      return initialCenter;
    }
  }, [complaintReportId]);
  return (
    <div>
      <AlertDialog.Root
        className={styles.AccordionRoot}
        open={alertDialog}
        onOpenChange={() => openOrCloseAlertDialog(!alertDialog)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content className={styles.AlertDialogContent}>
            {alertAction === "authenticate" ? (
              <FormComponent />
            ) : alertAction === "Inquiry" ? (
              <ComplaintForm />
            ) : alertAction === "Share" ? (
              <ShareComponent />
            ) : alertAction === "comment" ? (
              <CommentForm />
            ) : alertAction === "menu" || alertAction === "activity" ? (
              <PopOver />
            ) : alertAction === "thread" ||
              alertAction === "report" ||
              alertAction === "campaign" ? (
              <CreateReportForm />
            ) : alertAction === "map" ? (
              <div className={styles.map}>
                <button>
                  <X onClick={() => openOrCloseAlertDialog(false)} />
                </button>
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={16}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={defaultMapOptions}
                  >
                    {complaintReportId && (
                      <MarkerF
                        position={{
                          lat: Number(complaintReportId?.latitude),
                          lng: Number(complaintReportId?.longitude),
                        }}
                      />
                    )}
                  </GoogleMap>
                )}
              </div>
            ) : (
              <CreateReportForm />
            )}
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default AlertDialogComponent;
