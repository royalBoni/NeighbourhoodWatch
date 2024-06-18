"use client";
import React, { useState, useEffect } from "react";
import { useDataContext } from "../store/DataContext";
import ToastDemo from "../../components/toast/Toast";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  findCommentedReports,
  returnNumberOfVotes,
  checkIfVotedVotes,
} from "../../lib/actions";
import {
  CircleCheckBig,
  PencilRuler,
  Users,
  Share2,
  MapPin,
  AlarmCheck,
  Info,
  FileQuestion,
} from "lucide-react";
import { Button } from "../../components/button/Button";
import { geocode, RequestType, setDefaults } from "react-geocode";
import Link from "next/link";
import { useAlertDialogContext } from "../store/AlertDialog";
import { useMutation } from "@tanstack/react-query";

const Campaign = () => {
  const { campaigns } = useDataContext();
  const [locations, setLocations] = useState([]);
  const [storedUser, setStoredUser] = useState();
  const { specifyMapLocation, comments, votes } = useDataContext();
  const pathName = usePathname();
  const timerRef = React.useRef(0);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    const data = storedUserData ? JSON.parse(storedUserData) : null;
    setStoredUser(data);
  }, []);
  /* const storedUserData = sessionStorage.getItem("user");
  const storedUser = storedUserData ? JSON.parse(storedUserData) : null; */

  const {
    openOrCloseAlertDialog,
    specifyAction,
    specifyToastState,
    specifyToastMessage,
    specifyReportId,
  } = useAlertDialogContext();

  const locateLocationOnMap = (lat, long, campaign) => {
    openOrCloseAlertDialog(true);
    specifyAction("map"); // Action can be taken
    specifyReportId(campaign);
    specifyMapLocation({
      lat: parseFloat(lat),
      lng: parseFloat(long),
    });
  };

  const getLocationFromCoordinates = async (latitude, longitude) => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
    });

    try {
      const { results } = await geocode(
        RequestType.LATLNG,
        `${latitude},${longitude}`
      );
      return results[0].formatted_address;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchLocations = async (campaigns) => {
    const locationPromises = campaigns.map((campaign) =>
      getLocationFromCoordinates(campaign.latitude, campaign.longitude)
    );
    const locations = await Promise.all(locationPromises);
    setLocations(locations);
  };

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      fetchLocations(campaigns);
    }
  }, [campaigns]);

  const { mutate, reset } = useMutation({
    mutationFn: (data) =>
      fetch(
        data !== "upvote"
          ? `${baseUrl}api/campaign/${report.id}`
          : `${baseUrl}api/campaign"`,
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
    <div>
      {campaigns?.map((campaign, index) => (
        <div className={styles.container} key={campaign.id}>
          <ToastDemo />
          {pathName === "/user" && (
            <div
              onClick={() => isEnquiryAllowed(campaign.createdAt)}
              className={styles.enquiryBtn}
            >
              <Info />
            </div>
          )}

          <div className={styles.imageContainer}>
            <img
              src={campaign.img}
              alt="campaign image"
              className={styles.image}
            />
          </div>
          <div className={styles.containerItem}>
            <MapPin />
            <span>{locations[index] || "Loading..."}</span>
          </div>
          <div className={styles.containerItem}>
            <AlarmCheck />
            <span>
              {format(new Date(campaign.createdAt), "MMMM dd, yyyy HH:mm:ss")}
            </span>
          </div>
          <div className={styles.containerItem}>
            <Info />
            <span>{campaign.description}</span>
          </div>
          <div className={styles.containerItem}>
            <PencilRuler />
            <span>{!campaign.skillSet ? "Any" : campaign.skillSet}</span>Skills
            Needed
          </div>
          <div className={styles.containerItem}>
            <Users />
            <span>{campaign.numberOfPeopleNeeded}</span> People needed to carry
            out campaign
          </div>
          <div className={styles.containerItem}>
            {campaign.campaignCategory}
          </div>

          <div className={styles.interactions}>
            {/* SOCIALS */}
            <div className={styles.socialsContainer}>
              {/* UPVOTES*/}
              <div className={styles.socialsContainerItem}>
                <div
                  style={{
                    backgroundColor:
                      checkIfVotedVotes(votes, campaign.id, storedUser?.id) &&
                      "black",
                    color:
                      checkIfVotedVotes(votes, campaign.id, storedUser?.id) &&
                      "white",
                  }}
                  className={styles.voteBtn}
                  onClick={() => setOperations("upvote")}
                >
                  {" "}
                  <CircleCheckBig />
                </div>{" "}
                <span className={styles.span}>
                  {votes && returnNumberOfVotes(votes, campaign.id)}
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
                    locateLocationOnMap(
                      campaign.latitude,
                      campaign.longitude,
                      campaign
                    )
                  }
                />
              </Button>

              <Button>
                <Info />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Campaign;
