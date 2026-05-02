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
        .from("spreadsheet_row")
        .select(`
          *,
          spreadsheet (
            spreadsheet_name
          )
        `)
        .eq("spreadsheet.spreadsheet_name", spreadsheetdataName);

      if (error) {
        console.error("Supabase error:", error);
        setHasSpreadsheetDataLoaded(true);
        return;
      }

      console.log("Joined data:", data);

      const mappedRows = data.map(r => ({
        ...r.spreadsheet_row_data,
        spreadsheetdataID: r.spreadsheet_row_id,
        spreadsheetdataProcessed: r.spreadsheet_row_processed
      }));

      setRows(mappedRows);
      
      if (mappedRows.length > 0) {

        // 🧠 Extract columns from your JSON
        const cols =
          data.length > 0 && data[0].spreadsheet_row_data
            ? Object.keys(data[0].spreadsheet_row_data)
            : [];

        setColumns(Object.keys(mappedRows[0]));
      }
      
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
                      style={{ height: "auto" }}
                      className="object-contain -mr-6 -mt-4"
                      priority
                    /> </Link>
          <h1 className="--font-inter text-5xl">spreadsheets</h1>
     </div>
    <div className="flex flex-col flex-1  justify-top items-end bg-white font-inter dark:bg-black">
     
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
  <div className="flex flex-col flex-1 items-center justify-center py-10 pl-10 pr-0  bg-white font-inter dark:bg-black">
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
