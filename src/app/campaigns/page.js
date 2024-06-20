"use client";
import React, { useState } from "react";
import { useDataContext } from "../store/DataContext";
import ToastDemo from "../../components/toast/Toast";
import styles from "./page.module.css";
import CampaignCard from "../../components/campaignCard/CampaignCard";
import { allCategories } from "../../components/createReportForm/CreateReportForm";
import { Trash2, Ambulance, TrafficCone, Home, BusFront } from "lucide-react";

const Campaign = () => {
  const { campaigns } = useDataContext();
  const [category, setCategory] = useState();

  return (
    <div className={styles.mainContainer}>
      <ToastDemo />
      <div className={styles.container}>
        {campaigns?.map((campaign, index) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
      <div className={styles.right}>
        <h3>Categories</h3>
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
    </div>
  );
};

export default Campaign;
