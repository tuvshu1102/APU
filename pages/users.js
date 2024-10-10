"use client";

import Image from "next/image";
import "/app/globals.css";
import Sidebar from "/components/sidebar.js";
import Chart from "/components/chart.js";
import PseUsers from "/components/pseusers.js";
import UserTable from "@/components/usertable";
import { requireAuth } from "/components/serverside.js"; // Import the separate auth function

// pages/login.js
export default function Home() {
  return (
    <div className="w-screen h-screen bg-[#242424] flex font-custom">
      <Sidebar />
      <h1 className="w-[90%] h-full bg-slate-100 flex justify-center items-center">
        <PseUsers />
      </h1>
    </div>
  );
}
export const getServerSideProps = requireAuth;
