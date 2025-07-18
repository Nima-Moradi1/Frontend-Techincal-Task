import type { Metadata } from "next";
import "../globals.css";
import { firstTable } from "@/constants";
import Table from "@/components/ui/Table";
import Link from "next/link";
import MaxWidthWrapper from "@/components/ui/MaxWidthWrapper";

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
    <div className="p-3 bg-white rounded-lg">
        <div className="flex items-center gap-2 mb-5">
        <span className="text-blue-400 rounded-xl h-5 w-1 bg-blue-400">.</span>
        <h1>Lay Times</h1>
        </div>
        <div>
    <Table>
     <Table.Header>
      <th>Port Name</th>
      <th>| Cargo</th>
      <th>| F</th>
      <th>| BL Code</th>
      <th>| Quantity</th>
      <th>| L/D Rate</th>
      <th>| Term</th>
      <th>| Dem Rate</th>
      <th>| Des Rate/D</th>
      <th>| Allowed</th>
      <th>| Used</th>
      <th>| Deduction</th>
      <th>| Balance</th>
      <th>| Laycan From</th>
      <th>| Laycan To</th>
     </Table.Header>
     <Table.Body>
       {
        firstTable?.map((el) => (
          
          <Table.Row key={el.portName}>
            <td className="hover:bg-blue-50">
              <Link href={`/${el.urlIndex}`}
              >{el.portName}</Link>
              </td>
            <td>{el.cargo}</td>
            <td>{el.f.slice(0,4)}..</td>
            <td>{el.blCode}</td>
            <td>{el.quantity}</td>
            <td>{el.rate}</td>
            <td>{el.term}</td>
            <td>{el.demRate}</td>
            <td>{el.desRate}</td>
            <td>{el.allowed}</td>
            <td>{el.used}</td>
            <td>{el.deduction}</td>
            <td>{el.balance}</td>
            <td>{el.laycanFrom.slice(0,8)}..</td>
            <td>{el.laycanTo.slice(0,8)}..</td>
          </Table.Row>
        ))
       }
     </Table.Body>
    </Table>
        </div>
    </div>
        {children}
        </MaxWidthWrapper>
      </body>
    </html>
  );
}
