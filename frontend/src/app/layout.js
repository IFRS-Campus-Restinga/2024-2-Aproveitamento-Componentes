import "@/assets/globals.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/components/ui/NavBar";
import { PrimeReactProvider } from "primereact/api";
import { Footer } from "@/components/layout/Footer/footer";
import "./layout.css";

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ minHeight: "100vh" }}>
        <PrimeReactProvider>
          <AuthProvider>
            <NavBar />
            <div style={{ minHeight: "500px" }}>{children}</div>
            <Footer />
          </AuthProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
