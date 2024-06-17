"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  findCommentedReports,
  returnNumberOfVotes,
  checkIfVotedVotes,
} from "../../lib/actions";
import {
  MessagesSquare,
  ArrowBigUp,
  ArrowBigDown,
  Share2,
  MapPin,
  AlarmCheck,
  Info,
  FileQuestion,
} from "lucide-react";
import { Button } from "../button/Button";
import ToastDemo from "../toast/Toast";
import { geocode, RequestType, setDefaults } from "react-geocode";
import { usePathname } from "next/navigation";
import styles from "./reportCard.module.css";
import Link from "next/link";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import { useDataContext } from "../../app/store/DataContext";
import { useMutation } from "@tanstack/react-query";

const ReportCard = ({ report }) => {
  const [location, setLocation] = useState(null);
  const { specifyMapLocation, comments, votes } = useDataContext();
  const pathName = usePathname();
  const timerRef = React.useRef(0);

  const storedUserData = sessionStorage.getItem("user");
  const storedUser = storedUserData ? JSON.parse(storedUserData) : null;

  const {
    openOrCloseAlertDialog,
    specifyAction,
    specifyToastState,
    specifyToastMessage,
    specifyReportId,
  } = useAlertDialogContext();

  const locateLocationOnMap = (lat, long) => {
    openOrCloseAlertDialog(true);
    specifyAction("map"); // Action can be taken
    specifyReportId(report);
    specifyMapLocation({
      lat: parseFloat(lat),
      lng: parseFloat(long),
    });
  };

  const returnLocationFromCordinates = () => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
    });

    geocode(RequestType.LATLNG, `${report.latitude},${report.longitude}`)
      .then(({ results }) => {
        const address = results[0].formatted_address;
        setLocation(address);
      })
      .catch(console.error);
  };

  useEffect(() => {
    returnLocationFromCordinates();
  }, [report.latitude, report.longitude]);

  const { mutate, reset } = useMutation({
    mutationFn: (data) =>
      fetch(
        data !== "upvote"
          ? `http://localhost:3000/api/votes/${report.id}`
          : "http://localhost:3000/api/votes/",
        {
          // Using relative path to access API route
          method: data !== "upvote" ? "DELETE" : "POST",
          body: JSON.stringify({
            userId: storedUser.id,
            reportId: report.id,
          }),
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to vote report");
        }
        if (data !== "upvote") {
          console.log("successfully downvoted");
        } else {
          console.log("successfully upvoted");
        }

        reset();
        return res.json();
      }),
    onSuccess: (data) => {
      console.log("operation completed:", data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const setOperations = (operationId) => {
    if (!storedUser) {
      openOrCloseAlertDialog(true);
      specifyAction("authenticate");
    } else {
      if (operationId === "share") {
        openOrCloseAlertDialog(true);
        specifyAction("Share"); // Action can be taken
        specifyReportId(report);
      } else if (operationId === "comment") {
        openOrCloseAlertDialog(true);
        specifyAction("comment"); // Action can be taken
        specifyReportId(report);
      } else if (operationId === "upvote") {
        console.log("upvote");
        mutate("upvote");
      } else {
        console.log("down vote");
        mutate("downvote");
      }
    }
  };

  const fireToast = (duration, message) => {
    specifyToastMessage(message);
    specifyToastState(true);

    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      specifyToastState(false);
    }, duration);
  };

  const isEnquiryAllowed = (timestamp) => {
    // Parse the input timestamp
    const updatedDate = new Date(timestamp);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in time (in milliseconds)
    const timeDifference = currentDate - updatedDate;

    // Calculate the difference in days
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Check if 10 days have passed
    if (dayDifference > 10) {
      openOrCloseAlertDialog(true);
      specifyAction("Inquiry"); // Action can be taken
      specifyReportId(report);
    } else {
      fireToast(
        5000,
        "FORMAL COMPLAINT CAN ONLY BE MADE AFTER 10 DAYS WITHOUT STATUS CHANGE"
      ); // Action cannot be taken
    }
  };

  return (
    <div className={styles.container}>
      <ToastDemo />
      {pathName === "/user" && (
        <div
          onClick={() => isEnquiryAllowed(report.createdAt)}
          className={styles.enquiryBtn}
        >
          <Info />
        </div>
      )}

      <div className={styles.solveState}>{report?.solveStatus}</div>

      <div className={styles.imageContainer}>
        <img
          src={report.img}
          alt="report image"
          /* width={10}
          height={10} */
          //fill={true}
          className={styles.image}
        />
      </div>
      <div className={styles.containerItem}>
        <MapPin /> <span>{location}</span>
      </div>
      <div className={styles.containerItem}>
        <AlarmCheck />
        <span>
          {format(new Date(report.createdAt), "MMMM dd, yyyy HH:mm:ss")}
        </span>
      </div>
      <div className={styles.containerItem}>
        <Info />
        <span>{report.description}</span>
      </div>
      <div className={styles.containerItem}>
        <FileQuestion /> <span>{report.reportState}</span>
      </div>
      <div className={styles.containerItem}>{report.reportCategory}</div>

      <div className={styles.interactions}>
        {/* SOCIALS */}
        <div className={styles.socialsContainer}>
          {/* UPVOTES*/}
          <div className={styles.socialsContainerItem}>
            <div
              style={{
                backgroundColor:
                  checkIfVotedVotes(votes, report.id, storedUser?.id) &&
                  "black",
                color:
                  checkIfVotedVotes(votes, report.id, storedUser?.id) &&
                  "white",
              }}
              className={styles.voteBtn}
              onClick={() => setOperations("upvote")}
            >
              {" "}
              <ArrowBigUp />
            </div>{" "}
            <span className={styles.span}>
              {votes && returnNumberOfVotes(votes, report.id)}
            </span>
            <div
              className={styles.voteBtn}
              onClick={() => setOperations("downvote")}
            >
              <ArrowBigDown />
            </div>
          </div>

          {/* COMMENTS */}
          <div
            className={styles.socialsContainerItem}
            onClick={() => setOperations("comment")}
          >
            <MessagesSquare />
            <span className={styles.span}>
              {comments && findCommentedReports(comments, report.id)}
            </span>
          </div>
          <div
            className={styles.socialsContainerItem}
            onClick={() => setOperations("share")}
          >
            <Share2 />
            <span className={styles.span}>Share</span>
          </div>
        </div>

        <div className={styles.actionBtns}>
          <Button>
            <MapPin
              onClick={() =>
                locateLocationOnMap(report.latitude, report.longitude)
              }
            />
          </Button>

          <Link href={`/${report.id}`}>
            <Button>View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
