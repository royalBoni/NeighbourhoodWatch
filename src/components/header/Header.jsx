"use client";
import React, { useState, useEffect } from "react";
import styles from "./header.module.css";
import { User } from "lucide-react";
import { Button } from "../button/Button";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import Link from "next/link";
import Image from "next/image";
const Header = () => {
  //const [storedUser, setStoredUser] = useState(null);
  const { openOrCloseAlertDialog, specifyAction, alertAction } =
    useAlertDialogContext();
  const [storedUser, setStoredUser] = useState();

  const setOperations = (operationId) => {
    openOrCloseAlertDialog(true);
    specifyAction(operationId);
  };

  /* const storedUserData = sessionStorage.getItem("user");
  const storedUser = storedUserData ? JSON.parse(storedUserData) : null; */

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    setStoredUser(storedUserData);
  }, [openOrCloseAlertDialog, specifyAction, alertAction]);

  const logout = () => {
    sessionStorage.removeItem("user");
    window.location.reload(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Link href={"/"} className={styles.brand}>
          <Image
            src={"/logo.jpg"}
            width={50}
            height={50}
            alt="logo.jpg"
            className={styles.logoImage}
          />
        </Link>
        <ul className={styles.navItems}>
          {storedUser ? (
            <>
              {" "}
              <li onClick={logout} className={styles.logout}>
                <Button className={styles.reportButton}>LogOut</Button>
              </li>
              <Button
                className={styles.reportButton}
                onClick={() => setOperations("menu")}
              >
                + Create
              </Button>
              <li className={styles.user}>
                <Link href={"/user"}>
                  <User />
                </Link>
              </li>
            </>
          ) : (
            <Button
              onClick={() => setOperations("authenticate")}
              className={styles.reportButton}
            >
              Login
            </Button>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
