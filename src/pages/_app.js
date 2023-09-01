import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import 'tailwindcss/tailwind.css';

export default function App({ Component, pageProps: { ...pageProps } }) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );
}
