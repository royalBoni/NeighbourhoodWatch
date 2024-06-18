import { Inter } from "next/font/google";
import Header from "../components/header/Header";
import { AlertDialogProvider } from "./store/AlertDialog";
import AlertDialogComponent from "../components/alertDialog/AlertDialog";
import { DataProvider } from "./store/DataContext";
import { Providers } from "./providers";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import styles from "./layout.module.css";
import Activity from "../components/activityComponent/Activity";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Neighbourhood Watch",
  description: "An Application that promotes all inclusive governance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/logo.jpg" sizes="any" />
      <Providers>
        <DataProvider>
          <AlertDialogProvider>
            <body className={styles.container}>
              <Theme>
                <AlertDialogComponent />
                <Header />
                {/*                 <ToastComponent />
                 */}{" "}
                <Activity />
                {children}
              </Theme>
            </body>
          </AlertDialogProvider>
        </DataProvider>
      </Providers>
    </html>
  );
}
