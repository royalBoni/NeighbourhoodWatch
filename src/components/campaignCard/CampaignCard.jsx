"use client";
import React, { useState, useEffect } from "react";
import { useDataContext } from "../../app/store/DataContext";
import styles from "./campaigncard.module.css";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  findCommentedReports,
  returnNumberOfVotes,
  checkIfVotedVotes,
  returnNumberOfJoines,
  checkIfJoined,
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
import { baseUrl } from "../../lib/actions";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import { useMutation } from "@tanstack/react-query";

const CampaignCard = ({ campaign }) => {
  const { campaigns } = useDataContext();
  const [location, setLocation] = useState([]);
  const [storedUser, setStoredUser] = useState();
  const { specifyMapLocation, joincampaign } = useDataContext();
  const pathName = usePathname();
  const timerRef = React.useRef(0);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    const data = storedUserData ? JSON.parse(storedUserData) : null;
    setStoredUser(data);
  }, []);

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

  const returnLocationFromCordinates = () => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
    });

    geocode(RequestType.LATLNG, `${campaign.latitude},${campaign.longitude}`)
      .then(({ results }) => {
        const address = results[0].formatted_address;
        setLocation(address);
      })
      .catch(console.error);
  };

  useEffect(() => {
    returnLocationFromCordinates();
  }, [campaign.latitude, campaign.longitude]);

  const { mutate, reset } = useMutation({
    mutationFn: (data) =>
      fetch(`${baseUrl}api/joincampaign`, {
        // Using relative path to access API route
        method: data === "join" ? "POST" : "DELETE",
        body: JSON.stringify({
          campaignFanId: storedUser.id,
          email: storedUser.email,
          campaignOwnerId: campaign.creatorId,
          campaignId: campaign.id,
          userName: storedUser.username,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to join a campaign");
        } else {
          console.log("successfully joined");
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
        specifyReportId(campaign);
      } else if (operationId === "join") {
        if (checkIfJoined(joincampaign, campaign.id, storedUser?.id)) {
          mutate("unjoin");
        } else {
          mutate("join");
        }
      } else {
        console.log("send an inquiry to campaign owner");
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
    <div className={styles.mainContainerItem} key={campaign.id}>
      {pathName === "/user" && (
        <div
          onClick={() => isEnquiryAllowed(campaign.createdAt)}
          className={styles.enquiryBtn}
        >
          <Info />
        </div>
      )}

      <div className={styles.imageContainer}>
        <img src={campaign.img} alt="campaign image" className={styles.image} />
      </div>
      <div className={styles.mainContentContainer}>
        <div className={styles.mainContentContainerInfo}>
          {" "}
          <div className={styles.main}>
            <MapPin />
            <span>{location || "Loading..."}</span>
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
            <span>{!campaign.skillSet ? "Any" : campaign.skillSet}</span>
            Skills Needed
          </div>
          <div className={styles.containerItem}>
            <Users />
            <span>{campaign.numberOfPeopleNeeded}</span> People needed to carry
            out campaign
          </div>
          <div className={styles.containerItem}>
            {campaign.campaignCategory}
          </div>
        </div>

        <div className={styles.interactions}>
          {/* SOCIALS */}
          <div className={styles.socialsContainer}>
            {/* JOIN*/}
            <div className={styles.socialsContainerItem}>
              {returnNumberOfJoines(joincampaign, campaign.id) ===
              campaign.numberOfPeopleNeeded ? (
                checkIfJoined(joincampaign, campaign.id, storedUser?.id) ? (
                  <>
                    <div
                      style={{
                        backgroundColor:
                          checkIfJoined(
                            joincampaign,
                            campaign.id,
                            storedUser?.id
                          ) && "black",
                        color:
                          checkIfJoined(
                            joincampaign,
                            campaign.id,
                            storedUser?.id
                          ) && "white",
                      }}
                      className={styles.voteBtn}
                      onClick={() => setOperations("join")}
                    >
                      {" "}
                      <CircleCheckBig />
                    </div>{" "}
                    <span className={styles.span}>FULL</span>
                  </>
                ) : (
                  "FULL"
                )
              ) : (
                <>
                  <div
                    style={{
                      backgroundColor:
                        checkIfJoined(
                          joincampaign,
                          campaign.id,
                          storedUser?.id
                        ) && "black",
                      color:
                        checkIfJoined(
                          joincampaign,
                          campaign.id,
                          storedUser?.id
                        ) && "white",
                    }}
                    className={styles.voteBtn}
                    onClick={() => setOperations("join")}
                  >
                    {" "}
                    <CircleCheckBig />
                  </div>{" "}
                  <span className={styles.span}>
                    {joincampaign &&
                      returnNumberOfJoines(joincampaign, campaign.id)}
                  </span>
                </>
              )}
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
    </div>
  );
};

export default CampaignCard;
