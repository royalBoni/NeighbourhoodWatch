"use client";
import React from "react";
import { useAlertDialogContext } from "../../../app/store/AlertDialog";
import styles from "./share.module.css";
import "@radix-ui/themes/styles.css";
import { X } from "lucide-react";
import { baseUrl } from "../../../lib/actions";
import {
  FacebookShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

const ShareComponent = () => {
  const storedUserData = sessionStorage.getItem("user");
  const user = storedUserData ? JSON.parse(storedUserData) : null;

  const { openOrCloseAlertDialog, complaintReportId } = useAlertDialogContext();

  return (
    <div className={styles.container}>
      <div className={styles.titleClose}>
        <h1 className={styles.title}>Social Media Share</h1>

        <button>
          <X onClick={() => openOrCloseAlertDialog(false)} />
        </button>
      </div>

      <div className={styles.socials}>
        {" "}
        <FacebookShareButton
          url={`${baseUrl}${complaintReportId.id}`}
          quote={complaintReportId.description.trim(0, 30)}
          hashtag={"#reports"}
        >
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>
        <WhatsappShareButton
          url={`${baseUrl}${complaintReportId.id}`}
          quote={complaintReportId.description.trim(0, 30)}
          hashtag={"#reports"}
        >
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>
        <TelegramShareButton
          url={`${baseUrl}${complaintReportId.id}`}
          quote={complaintReportId.description.trim(0, 30)}
          hashtag={"#reports"}
        >
          <TelegramIcon size={40} round={true} />
        </TelegramShareButton>
        <TwitterShareButton
          url={`${baseUrl}${complaintReportId.id}`}
          quote={complaintReportId.description.trim(0, 30)}
          hashtag={"#reports"}
        >
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>
      </div>
    </div>
  );
};
export default ShareComponent;
