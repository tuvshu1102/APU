"use client";

import Image from "next/image";
import "/app/globals.css";
import Sidebar from "/components/sidebar.js";
import Chart from "/components/chart.js";
import Pse from "/components/pse.js";
import { requireAuth } from "/components/serverside.js"; // Import the separate auth function

export default function Home({ session }) {
  return (
    <div className="w-screen h-screen bg-black flex text-black">
      <Sidebar />
      <h1 className="w-[90%] h-full bg-slate-100">
        <Pse />
      </h1>
    </div>
  );
}

export const getServerSideProps = requireAuth;
