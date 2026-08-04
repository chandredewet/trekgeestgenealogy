"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Loader from "../components/Loader";
import Image from "next/image";
import Link from "next/link";

export default function ExploreDNAPage() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hasSpreadsheetDataLoaded, setHasSpreadsheetDataLoaded] = useState(false);
  const [spreadsheetList, setSpreadsheetList] = useState([]);
  // const [spreadsheetdataName, setSpreadsheetdataName] = useState("VGKChurchUpington");
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState("");
  
  // 🚀 Fetch SpreadsheetNames
  useEffect(() => {
  const fetchSpreadsheets = async () => {
    const { data, error } = await supabase
      .from("spreadsheet")
      .select("spreadsheet_name");

    if (error) {
      console.error("Spreadsheet fetch error:", error);
      return;
    }
  
    setSpreadsheetList(data || []);

    // only set default if data exists
    if (data && data.length > 0) {
      setSelectedSpreadsheet(data[0].spreadsheet_name);
    }
  };

  fetchSpreadsheets();
  }, []);

  // 🚀 Fetch Spreadsheet Data
  useEffect(() => {
    if (!selectedSpreadsheet) return;

    const fetchData = async () => {

      if (!selectedSpreadsheet) return;

      const { data, error } = await supabase
        .from("spreadsheet_row")
        .select(`
          *,
          spreadsheet (
            spreadsheet_name
          )
        `)
        .eq("spreadsheet.spreadsheet_name", selectedSpreadsheet);

      if (error) {
        console.error("Supabase error:", error);
        setHasSpreadsheetDataLoaded(true);
        return;
      }

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


        const SYSTEM_COLUMNS = [
          "spreadsheetdataID",
          "spreadsheetdataProcessed"
        ];         
        
        setColumns( 
          Object.keys(mappedRows[0]).filter(
            col => !SYSTEM_COLUMNS.includes(col)
          )
        );
      }
      
      setHasSpreadsheetDataLoaded(true);
    };

    fetchData();
  }, [selectedSpreadsheet]);

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
          <h1 className="--font-inter text-5xl">explore dna</h1>
     </div>
    </div>
    <div className="flex flex-col flex-1 items-center justify-center py-10 pl-10 pr-10  bg-white font-inter dark:bg-black">
    
    </div>
  </div>
  );
}
