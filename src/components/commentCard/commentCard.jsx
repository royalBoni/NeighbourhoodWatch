import React from "react";
import { useState, useEffect } from "react";
import { useDataContext } from "../../app/store/DataContext";
import { format } from "date-fns";
import Image from "next/image";
import styles from "./commentCard.module.css";

const CommentCard = ({ comment }) => {
  const [poster, setPoster] = useState(null);
  const { reportersData } = useDataContext();

  const returnCommenter = (id) => {
    const findCommenter = reportersData?.find((reporter) => reporter.id === id);
    return findCommenter;
  };

  // Function to fetch the poster
  /*  const fetchPoster = () => {
   
    const poster = returnCommenter(comment?.user_id);
    setPoster(poster);
  
  };
 */
  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    //fetchPoster();
    const fetchPoster = () => {
      const poster = returnCommenter(comment?.reporterId);
      setPoster(poster);
    };

    fetchPoster();
  }, [comment?.reporterId, returnCommenter]);
  return (
    <div className={styles.container}>
      <div className={styles.containerItem}>
        <div className={styles.imageAndName}>
          <Image
            src={"/noavatar.png"}
            alt=""
            width={40}
            height={40}
            className={styles.image}
          />
          <h4 className={styles.name}>
            {returnCommenter(comment?.reporterId)?.name}
          </h4>
        </div>

        <div className="text-lg font-bold">
          {comment.createdAt &&
            format(new Date(comment?.createdAt), "MMMM dd, yyyy")}
        </div>
      </div>
      <div className={styles.containerItem}>{comment?.comment}</div>
    </div>
  );
};

export default CommentCard;
