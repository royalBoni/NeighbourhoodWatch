"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { setDefaults, geocode, RequestType } from "react-geocode";
import { format } from "date-fns";
import { useDataContext } from "../store/DataContext";
import PostUser from "../../components/postUser/postUser";
import { useAlertDialogContext } from "../store/AlertDialog";
import { Spinner } from "@radix-ui/themes";
import { Theme } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import ToastDemo from "../../components/toast/Toast";
import CommentCard from "../../components/commentCard/commentCard";
import {
  Clock,
  Trash2,
  Ambulance,
  TrafficCone,
  Home,
  BusFront,
  Share2,
  ArrowBigUp,
  Bookmark,
  SendHorizonal,
  MessagesSquare,
  MapPin,
} from "lucide-react";
import {
  findCommentedReports,
  findCommentedOnReports,
  findReport,
} from "../../lib/actions";

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

const SinglePostPage = (param) => {
  const { params } = param;
  const [location, setLocation] = useState();
  const [inputContent, setInputContent] = useState();

  const timerRef = React.useRef(0);

  const { reportersData, comments, reports } = useDataContext();
  const returnLocationFromCordinates = () => {
    setDefaults({
      key: "AIzaSyCJQ09aSMpFlGyonpuovdsEWLrJAh2nN_Y", // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
    });

    geocode(
      RequestType.LATLNG,
      `${reportData.latitude},${reportData.longitude}`
    )
      .then(({ results }) => {
        const address = results[0].formatted_address;
        setLocation(address);
      })
      .catch(console.error);
  };

  const reportData = findReport(reports, params.slug);

  const fireToast = (duration, message) => {
    specifyToastMessage(message);
    specifyToastState(true);

    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      specifyToastState(false);
    }, duration);
  };

  const returnPosterProfile = (id) => {
    const reporter = reportersData?.find((item) => item.id === id);
    return reporter;
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCJQ09aSMpFlGyonpuovdsEWLrJAh2nN_Y",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (reportData) {
    returnLocationFromCordinates(reportData.latitude, reportData.longitude);
  }

  const center = React.useMemo(() => {
    if (reportData) {
      return {
        lat: Number(reportData?.latitude),
        lng: Number(reportData?.longitude),
      };
    } else {
      return initialCenter;
    }
  }, [reportData]);

  const {
    openOrCloseAlertDialog,
    specifyAction,
    specifyToastState,
    specifyToastMessage,
    specifyReportId,
  } = useAlertDialogContext();

  const storedUserData = sessionStorage.getItem("user");
  const storedUser = storedUserData ? JSON.parse(storedUserData) : null;

  const setOperations = (operationId) => {
    if (!storedUser) {
      openOrCloseAlertDialog(true);
      specifyAction("authenticate");
    } else {
      if (operationId === "share") {
        openOrCloseAlertDialog(true);
        specifyAction("Share"); // Action can be taken
        specifyReportId(reportData);
      } else if (operationId === "comment") {
        openOrCloseAlertDialog(true);
        specifyAction("comment"); // Action can be taken
        specifyReportId(reportData);
      } else if (operationId === "map") {
        openOrCloseAlertDialog(true);
        specifyAction("map"); // Action can be taken
        specifyReportId(reportData);
      }
    }
  };

  const submitComment = () => {
    if (!storedUser) {
      openOrCloseAlertDialog(true);
      specifyAction("authenticate");
    }
    if (inputContent.length > 0) {
      mutate(inputContent);
    }
  };

  const { mutate, reset, isPending } = useMutation({
    mutationFn: (data) =>
      fetch("http://localhost:3000/api/comment", {
        // Using relative path to access API route
        method: "POST",
        body: JSON.stringify({
          comment: data,
          reportId: reportData.id,
          reporterId: storedUser.id,
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
      setInputContent("");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  return (
    <div className={styles.container}>
      <ToastDemo />
      <div className={styles.left}>
        <div className={styles.leftLeft}>
          {" "}
          {!reportData ? (
            <Spinner />
          ) : (
            <div className={styles.leftContent}>
              <div className={styles.bullet}>
                <div
                  style={{
                    color:
                      reportData.solveStatus === "Accepted" ? "red" : "black",
                  }}
                  className={styles.status}
                >
                  {reportData.solveStatus}
                </div>

                <div className={styles.bulletSocials}>
                  <div
                    className={styles.socialsContainerItemMap}
                    onClick={() => setOperations("map")}
                  >
                    <MapPin />
                  </div>

                  <div className={styles.socialsContainerItem}>
                    <MessagesSquare />
                    <span className={styles.span}>
                      {comments && findCommentedReports(comments, params.slug)}
                    </span>
                  </div>

                  <div
                    className={styles.socialsContainerItem}
                    onClick={() => setOperations("upvote")}
                  >
                    <ArrowBigUp /> <span className={styles.span}>402</span>
                  </div>
                  <div
                    className={styles.socialsContainerItem}
                    onClick={() => setOperations("share")}
                  >
                    <Share2 />
                    <span className={styles.span}>Share</span>
                  </div>
                </div>
              </div>
              <div className={styles.imageContainer}>
                {reportData && (
                  <img
                    src={`${reportData?.img}`}
                    alt="report image"
                    className={styles.image}
                  />
                )}
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.locationAndDate}>
                  <h2 className={styles.title}>{location}</h2>{" "}
                  <span className={styles.time}>
                    <h3>
                      <Clock />
                    </h3>

                    {format(
                      new Date(reportData.createdAt),
                      "MMMM dd, yyyy HH:mm:ss"
                    )}
                  </span>
                </div>

                <div>
                  <h3>Description</h3>
                  <p>{reportData.description}</p>
                </div>
                <div>
                  <h3>Category</h3>
                  <div className={styles.category}>
                    {reportData.reportCategory === "sanitation" ? (
                      <Trash2 />
                    ) : reportData.reportCategory === "health" ? (
                      <Ambulance />
                    ) : reportData.reportCategory === "transportation" ? (
                      <BusFront />
                    ) : reportData.reportCategory === "road" ? (
                      <TrafficCone fill="orange" />
                    ) : (
                      <Home fill="red" />
                    )}

                    <p>{reportData.reportCategory}</p>
                  </div>
                </div>

                <PostUser user={returnPosterProfile(reportData.reporterId)} />

                <div className={styles.commentSection}>
                  {findCommentedOnReports(comments, params.slug)?.map(
                    (comment) => (
                      <CommentCard comment={comment} key={comment.id} />
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <Theme>
          <div className={styles.commentInput}>
            <div className={styles.commentInputContainer}>
              {" "}
              <input
                value={inputContent}
                type="text"
                name=""
                id=""
                onChange={(e) => setInputContent(e.target.value)}
              />
              <div className={styles.sendBtn} onClick={submitComment}>
                {isPending ? <Spinner /> : <SendHorizonal fill="black" />}
              </div>
            </div>
          </div>
        </Theme>
      </div>

      <div className={styles.mapData}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={defaultMapOptions}
          >
            {reportData && (
              <MarkerF
                position={{
                  lat: Number(reportData?.latitude),
                  lng: Number(reportData?.longitude),
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SinglePostPage;
