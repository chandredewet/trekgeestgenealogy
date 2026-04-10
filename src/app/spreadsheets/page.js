"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import SpreadsheetTable from "../components/SpreadsheetTable";
import Loader from "../components/Loader";
import Image from "next/image";
import Link from "next/link";

export default function SpreadsheetsPage() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hasSpreadsheetDataLoaded, setHasSpreadsheetDataLoaded] = useState(false);
  const [spreadsheetdataName, setSpreadsheetdataName] = useState("VGKChurchUpington");

  // 🚀 Fetch your CURRENT data (unchanged)
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("spreadsheetdata") // your current table
        .select("*")
        .eq("spreadsheetdataName", spreadsheetdataName);


      if (error) {
        console.error("Supabase error:",error);
        setHasSpreadsheetDataLoaded(true); // still stop loader
        return;
      }

      const mappedRows = data.map(r => ({
        ...r.spreadsheetdataData,
        spreadsheetdataID: r.spreadsheetdataID,
        spreadsheetdataProcessed: r.spreadsheetdataProcessed
      }));

      console.log(mappedRows)

      setRows(mappedRows);

      // 🧠 Extract columns from your JSON
      const cols =
        data.length > 0 && data[0].spreadsheetdataData
          ? Object.keys(data[0].spreadsheetdataData)
          : [];

      setColumns(cols);
      setHasSpreadsheetDataLoaded(true);
    };

    fetchData();
  }, [spreadsheetdataName]);

  async function toggleProcessed(id, current) {
      await supabase
        .from("spreadsheetdata")
        .update({ processed: !current })
        .eq("id", id);
  
      // Refresh UI
      setRows(rows.map((r) => (r.id === id ? { ...r, processed: !current } : r)));
    }

  return (

  <div className="p-6">
    
    <div className="flex items-start">
      <div className="flex items-start">
          {/* HEADER */}
            <Link href="/"><Image
                      src="/hatlogo.png"
                      alt="Trekgeest logo"
                      width={150}
                      height={150}
                       className="object-contain -mr-6 -mt-4"
                      priority
                    /> </Link>
          <h1 className="--font-google-sans text-5xl">spreadsheets</h1>
     </div>
    <div className="flex flex-col flex-1  justify-top items-end bg-white font-sans dark:bg-black">
     
      {/* UPLOAD BUTTON (placeholder) */}
      <div className="mb-4">
        <button className="bg-[#c06a4d] text-white px-4 py-2 rounded-md">
          Upload CSV
        </button>
      </div>
      {/* DROPDOWN (future-ready) */}
      <div className="mb-4">
        <select className="border px-3 py-2 rounded-md">
          <option>All Spreadsheets</option>
        </select>
      </div>
    </div>
</div>
  <div className="flex flex-col flex-1 items-center justify-center px-10 py-10  bg-white font-sans dark:bg-black">
    {!hasSpreadsheetDataLoaded ? (    
       <Loader />
      ) : (         
        <SpreadsheetTable spreadsheetdataName="VGKChurchUpington"
        spreadsheetColumns={columns}
        spreadsheetRows = {rows}/>
     )}
    </div>
  </div>
  );
}
