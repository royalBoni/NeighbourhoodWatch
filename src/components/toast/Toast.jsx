import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import styles from "./toast.module.css";
import { useAlertDialogContext } from "../../app/store/AlertDialog";

const ToastDemo = () => {
  const timerRef = React.useRef(0);
  const { toastState, toastMessage } = useAlertDialogContext();

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={styles.ToastRoot}
        open={toastState}
        //onOpenChange={setOpen}
      >
        <Toast.Title className={styles.ToastTitle}>{toastMessage}</Toast.Title>
        <Toast.Description asChild>
          {/* <time className={styles.ToastDescription}>{toastMessage}</time> */}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className={styles.ToastViewport} />
    </Toast.Provider>
  );
};

export default ToastDemo;
