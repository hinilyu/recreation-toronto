import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Recreation Toronto",
  description: "Tired of using eFun? Here's a new way for discovering Toronto's diverse arts, sports, and general interest programs",
  icons: {
    icon: "/assets/logo.png",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
