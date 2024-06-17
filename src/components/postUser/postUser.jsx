import React from "react";
import styles from "./postUser.module.css";
import { Star, Gem } from "lucide-react";
import Image from "next/image";

const PostUser = ({ user }) => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.avatar}
        src={user?.img ? `${user?.img}` : "/noavatar.png"}
        alt=""
        width={50}
        height={50}
      />
      <div className={styles.authorContainer}>
        <span className={styles.username}>{user?.name}</span>

        {user?.badge === "pro" ? (
          <Star fill="red" strokeWidth={0} />
        ) : user?.badge === "pro" ? (
          <Gem fill="yellow" strokeWidth={0} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PostUser;
