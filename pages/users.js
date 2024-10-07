"use client";

import Image from "next/image";
import "/app/globals.css";
import Sidebar from "/components/sidebar.js";
import Chart from "/components/chart.js";
import UserTable from "@/components/usertable";
import { requireAuth } from "/components/serverside.js"; // Import the separate auth function

// pages/login.js
export default function Home() {
  return (
    <div className="w-screen h-screen bg-black flex">
      <Sidebar />
      <h1 className="w-[90%] h-full bg-slate-100 flex justify-center items-center">
        <UserTable />
      </h1>
    </div>
  );
}
export const getServerSideProps = requireAuth;
