import type { Metadata } from "next";
import "../globals.css";
import MaxWidthWrapper from "@/components/ui/MaxWidthWrapper";
import MockedPortsComponent from "@/components/MockedPortsComponent";

export const metadata: Metadata = {
  title: "Technical Task",
  description: "Done by Nima Moradirad",
};

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased`}
        >
        <MaxWidthWrapper>
    <MockedPortsComponent />
        {children}
        </MaxWidthWrapper>
      </body>
    </html>
  );
}
