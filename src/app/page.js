"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useDataContext } from "./store/DataContext";
import { Spinner } from "@radix-ui/themes";
import { Search } from "lucide-react";
import ReportCard from "../components/reportCard/ReportCard";
import ToastDemo from "../components/toast/Toast";

export default function Home() {
  const { reports, reportsLoading, centerLocation } = useDataContext();

  const [searchItems, setSearchItems] = useState([]);

  const containerStyle = {
    width: "100%",
    height: "100%",
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

  const settings = {
    dots: false,
    infinite: true,
    swipeToSlide: true,
    speed: 7000,
    slidesToShow: 2,
    slidesToScroll: 1,
    lazyLoad: true,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 756,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 930,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],

    nextArrow: (
      <div>
        <div className="next-slick-arrow">l</div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className="prev-slick-arrow">r</div>
      </div>
    ),
  };
  const filterItem = [
    {
      listName: "Report Type",
      listItems: ["Sanitation", "Road", "Health", "Residential"],
    },
    {
      listName: "Report Status",
      listItems: ["Registered", "Processing", "Accepted", "Fixing", "Fixed"],
    },
    { listName: "Sort By", listItems: ["Time", "Popularity"] },
  ];

  const projects = [
    {
      title: "Tour",
      shortIntro:
        "This is a static website for a travel tour agency that seeks to increase its online availability",
    },
    {
      title: "Coffee",
      shortIntro:
        "A website for a small coffe shop displaying its services and prices and its working hours",
    },
    {
      title: "Royal Market",
      shortIntro:
        "A multi vendor e-commerce center app for various sellers seeking to sell and buyers seeking to buy",
    },
    {
      title: "Inspire",
      shortIntro:
        "A social media app which connects people who seek to inspire people to others who needs an inspiration and coaching",
    },
    {
      title: "AdminDASH",
      shortIntro:
        "A dashboard app that is used to store inventory and used to manage customers and recordds an e-commerce app",
    },
    {
      title: "RoyalFood",
      shortIntro:
        "This is an app that takes a restaurant online and allow customers to make an order online.",
    },
  ];

  return (
    <main className={styles.main}>
      <ToastDemo />
      <div className={styles.bulletCarousel}>
        {" "}
        <Slider {...settings}>
          {projects.map((item) => (
            <div key={item.shortIntro}>{item.shortIntro}</div>
          ))}
        </Slider>
      </div>
      <div className={styles.down}>
        <div className={styles.downTop}>
          {/* SEARCH */}
          <div>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <div className={styles.inputFields}>
            {filterItem.map((item) => (
              <select
                value={searchItems}
                onChange={(event) => setSearchItems(event.target.value)}
                className={styles.select}
              >
                {" "}
                <option>{item.listName}</option>
                {item.listItems.map((e, index) => (
                  <option key={index} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            ))}

            <button className={styles.applyButton}>Apply</button>
          </div>

          <Image
            className={styles.menuButton}
            src={"/menu.png"}
            alt=""
            width={30}
            height={30}
            /*  onClick={() => setOpen((prev) => !prev)} */
          />
        </div>
        <div className={styles.downDown}>
          <div className={styles.left}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={centerLocation}
                zoom={16}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {reports &&
                  reports.map((item) => (
                    <MarkerF
                      position={{
                        lat: Number(item?.latitude),
                        lng: Number(item?.longitude),
                      }}
                    />
                  ))}
              </GoogleMap>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.right}>
            {reportsLoading ? (
              <div className={styles.rightLoader}>
                <Spinner size="3" />
              </div>
            ) : (
              <div className={styles.rightContent}>
                {reports?.map((report) => (
                  <div className={styles.rightContentItem} key={report.id}>
                    <ReportCard report={report} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
