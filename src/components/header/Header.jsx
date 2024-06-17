"use client";
import React, { useState, useEffect } from "react";
import styles from "./header.module.css";
import { User } from "lucide-react";
import { Button } from "../button/Button";
import { useAlertDialogContext } from "../../app/store/AlertDialog";
import Link from "next/link";
const Header = () => {
  //const [storedUser, setStoredUser] = useState(null);
  const { openOrCloseAlertDialog, specifyAction } = useAlertDialogContext();

  const setOperations = (operationId) => {
    openOrCloseAlertDialog(true);
    specifyAction(operationId);
  };

  const storedUserData = sessionStorage.getItem("user");
  const storedUser = storedUserData ? JSON.parse(storedUserData) : null;

  /* useEffect(() => {
    if (typeof sessionStorage !== "undefined") {
      const storedUserData = sessionStorage.getItem("user");
      setStoredUser(storedUserData ? JSON.parse(storedUserData) : null);
    }
  }, []);
   */
  const logout = () => {
    sessionStorage.removeItem("user");
    window.location.reload(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.brand}>N-W</div>
        <ul className={styles.navItems}>
          <li>
            {" "}
            <Link href={"/"}>
              <Button className={styles.reportButton}>Home</Button>
            </Link>
          </li>

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
            <li onClick={() => setOperations("authenticate")}>Login</li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
