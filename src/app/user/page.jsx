"use client";
import React, { useState, useEffect } from "react";
import Graph from "../../components/Graph";
import {
  Star,
  Gem,
  BarChart,
  Users,
  BookCopy,
  BadgeCent,
  Settings,
} from "lucide-react";
import Image from "next/image";
import styles from "./page.module.css";
import { useDataContext } from "../store/DataContext";
import ReportCard from "../../components/reportCard/ReportCard";

const UserPage = () => {
  const [user, setUser] = useState();
  /*   const storedUserData = sessionStorage.getItem("user");
  const user = storedUserData ? JSON.parse(storedUserData) : null; */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user") === "true";
    setUser(storedUser);
  }, []);

  const { reports, comments, votes } = useDataContext();

  const [componentToRender, setComponentToRender] = useState("Reports");
  const [reportItem, setReportItem] = useState("All");

  const listItems = ["Reports", "Analytics", "Points Earned", "Community"];
  const solveStatus = ["All", "Fixed", "Not Fixed"];

  const countTotalComments = (data) => {
    return reports?.reduce((total, report) => {
      const reportData = data?.filter(
        (item) => item.reportId === report.id && report.reporterId === user?.id
      );
      return total + reportData?.length;
    }, 0);
  };

  const countedStatusNumber = (status) => {
    const filteredReports = reports?.filter(
      (item) => item.reporterId === user?.id && item.solveStatus === status
    );
    return filteredReports?.length;
  };

  const statusData = [
    {
      id: "Processing",
      label: "Processing",
      value: countedStatusNumber("Processing"),
      color: "hsl(91, 70%, 50%)",
    },
    {
      id: "Accepted",
      label: "Accepted",
      value: countedStatusNumber("Accepted"),
      color: "hsl(61, 70%, 50%)",
    },
    {
      id: "Fixing",
      label: "Fixing",
      value: countedStatusNumber("Fixing"),
      color: "hsl(74, 70%, 50%)",
    },
    {
      id: "Fixed",
      label: "Fixed",
      value: countedStatusNumber("Fixed"),
      color: "hsl(80, 70%, 50%)",
    },
  ];

  const data = [
    {
      id: "comments",
      label: "comments",
      value: countTotalComments(comments),
      color: "hsl(91, 70%, 50%)",
    },
    {
      id: "upvotes",
      label: "upvotes",
      value: countTotalComments(votes),
      color: "hsl(80, 70%, 50%)",
    },
    {
      id: "shares",
      label: "shares",
      value: 8,
      color: "hsl(74, 70%, 50%)",
    },
  ];

  const returnUserReports = () => {
    if (reportItem === "Not Fixed") {
      const filteredReports = reports?.filter(
        (item) => item.reporterId === user?.id && item.solveStatus !== "Fixed"
      );

      return filteredReports;
    } else if (reportItem === "Fixed") {
      const filteredReports = reports?.filter(
        (item) => item.reporterId === user?.id && item.solveStatus === "Fixed"
      );

      return filteredReports;
    } else {
      const filteredReports = reports?.filter(
        (item) => item.reporterId === user?.id
      );

      return filteredReports;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.upper}>{componentToRender.toUpperCase()}</div>
      <div className={styles.lower}>
        <div className={styles.left}>
          <div className={styles.profile}>
            <Image
              className={styles.avatar}
              src={user?.img ? `${user?.img}` : "/noavatar.png"}
              alt=""
              width={50}
              height={50}
            />
            <div className={styles.authorContainer}>
              <h4 className={styles.username}>{user?.username}</h4>
              <span className={styles.badge}>
                {" "}
                {user?.badge === "pro" ? (
                  <span style={{ color: "red" }}>
                    <Star fill="red" strokeWidth={0} /> {user?.badge} Profile
                  </span>
                ) : user?.badge === "pro" ? (
                  <span style={{ color: "yellow" }}>
                    <Gem fill="yellow" strokeWidth={0} /> {user?.badge} Profile
                  </span>
                ) : (
                  <></>
                )}{" "}
              </span>
            </div>
          </div>
          <div className={styles.user}>
            <div className={styles.userItems}>
              {listItems.map((item) => (
                <div
                  key={item}
                  onClick={() => setComponentToRender(item)}
                  className={styles.userItem}
                  style={{ color: item === componentToRender ? "white" : "" }}
                >
                  {item === "Reports" ? (
                    <BookCopy />
                  ) : item === "Analytics" ? (
                    <BarChart />
                  ) : item === "Points Earned" ? (
                    <BadgeCent />
                  ) : (
                    <Users />
                  )}
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div
            className={styles.settings}
            onClick={() => setComponentToRender("Settings")}
            style={{ color: componentToRender === "Settings" ? "white" : "" }}
          >
            <Settings /> Settings
          </div>
        </div>
        <div className={styles.right}>
          {/* REPORTS COMPONENT */}
          {componentToRender === "Reports" ? (
            <div className={styles.reports}>
              <div className={styles.reportsTop}>
                <div className={styles.reportsTopTop}>
                  {" "}
                  {solveStatus.map((item) => (
                    <div
                      key={item}
                      className={styles.reportsTopItem}
                      style={{
                        color: reportItem === item && "white",
                        backgroundColor: reportItem === item && "black",
                      }}
                      onClick={() => setReportItem(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className={styles.reportsTopTop}>
                  {returnUserReports()?.length} Reports
                </div>
              </div>
              <div className={styles.reportsDown}>
                {returnUserReports() &&
                  returnUserReports()?.map((item) => (
                    <div key={item.id} className={styles.reportsDownItem}>
                      <ReportCard report={item} />
                    </div>
                  ))}
              </div>
            </div>
          ) : /* ANALYTICS */
          componentToRender === "Analytics" ? (
            <div className={styles.analytics}>
              <div className={styles.analyticsItem}>
                <Graph data={data} />
              </div>
              <div className={styles.analyticsItem}>
                <Graph data={statusData} />
              </div>
            </div>
          ) : componentToRender === "Points Earned" ? (
            <div>Points Earned</div>
          ) : componentToRender === "Settings" ? (
            <div>Settings</div>
          ) : (
            <div>Community</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
