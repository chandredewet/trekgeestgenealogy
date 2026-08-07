"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import SpreadsheetTable from "../components/SpreadsheetTable";
import Loader from "../components/Loader";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";

export default function SpreadsheetsPage() {
  
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hasSpreadsheetDataLoaded, setHasSpreadsheetDataLoaded] = useState(false);
  const [spreadsheetList, setSpreadsheetList] = useState([]);
  const [selectedSpreadsheetID, setSelectedSpreadsheetID] = useState("");
  const [mode, setMode] = useState("existing");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [newSpreadsheetName, setNewSpreadsheetName] = useState("");
  // 🚀 updated every time page rerenders
  const selectedSpreadsheet = spreadsheetList.find(
  sheet => sheet.spreadsheet_id === selectedSpreadsheetID
  );
  const spreadsheetName = selectedSpreadsheet?.spreadsheet_name ?? "";
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchSpreadsheet = async () => {
      const { data, error } = await supabase
        .from("spreadsheet")
        .select("spreadsheet_id, spreadsheet_name");

      if (error) {
        console.error("Spreadsheet fetch error:", error);
        return;
      }
  
      setSpreadsheetList(data || []);

      // only set default if data exists
      if (!selectedSpreadsheetID && data && data.length > 0) {
             setSelectedSpreadsheetID(data[0].spreadsheet_id);
      }
  };

  const fetchSpreadsheetRow = async () => {

    if (!selectedSpreadsheetID) return;

    const { data, error } = await supabase
      .from("spreadsheet_row")
      .select("*")
      .eq("spreadsheet_id", selectedSpreadsheetID);

    if (error) {
      console.error("Supabase error:", error);
      setHasSpreadsheetDataLoaded(true);
      return;
    }

    const mappedRows = data.map(r => ({
      ...r.spreadsheet_row_data,
      spreadsheetRowID: r.spreadsheet_row_id,
      spreadsheetRowProcessed: r.spreadsheet_row_processed
    }));

    console.log("Raw Supabase row:", data[0]);
    console.log("Mapped row:", mappedRows[0]);

    setRows(mappedRows);
    
    if (mappedRows.length > 0) {

      // 🧠 Extract columns from your JSON
      const cols =
        data.length > 0 && data[0].spreadsheet_row_data
          ? Object.keys(data[0].spreadsheet_row_data)
          : [];

      const SYSTEM_COLUMNS = [
        "spreadsheetRowID",
        "spreadsheetRowProcessed"
      ];         
      
      setColumns( 
        Object.keys(mappedRows[0]).filter(
          col => !SYSTEM_COLUMNS.includes(col)
        )
      );
    };
    setHasSpreadsheetDataLoaded(true);
  };

  async function handleAddToPeopleDB(row) {
    console.log("Adding row:", row);
    console.log("Row ID:", row.spreadsheetRowID);
    console.log("Object Keys", Object.keys(row));

  const { data, error } = await supabase
    .from("spreadsheet_row")
    .update({
      spreadsheet_row_processed: true
    })
    .eq(
      "spreadsheet_row_id",
      row.spreadsheetRowID
    )
    .select();

    console.log("Updated row:", data);
    console.log("Update error:", error);

    if (error) {
      console.log(error);
      return;
    }

    await fetchSpreadsheetRow();

  }

  // 🚀 Fetch Spreadsheet Name and ID
  useEffect(() => {
    const loadSpreadsheet = async () => {
      await fetchSpreadsheet();
    };

    loadSpreadsheet();    
  }, []);

  // 🚀 Fetch Spreadsheet Data
  useEffect(() => {
    if (!selectedSpreadsheetID) return; 

    const loadSpreadsheetRow = async () => {
    await fetchSpreadsheetRow();
    };

    loadSpreadsheetRow();
 
  }, [selectedSpreadsheetID]);

  const handleFileUpload = (event) => {

    const file = selectedFile;;

    if (!file) {
    console.log("No file selected");
    return;
    }

    console.log("1️⃣ File selected:", file.name);


    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {

        console.log("2️⃣ CSV parsed");
        console.log("Rows from CSV:", results.data.length);
        console.log("First CSV row:", results.data[0]);

        let spreadsheetIDToUse = selectedSpreadsheetID;


        // =========================
        // CREATE NEW SPREADSHEET
        // =========================
        if (mode === "new") {

          console.log("3️⃣ Creating new spreadsheet");

          if (!newSpreadsheetName.trim()) {
            console.error("Please enter spreadsheet name");
            return;
          }

          const { data: newSpreadsheet, error: spreadsheetError } =
            await supabase
              .from("spreadsheet")
              .insert({
                spreadsheet_name: newSpreadsheetName
              })
              .select()
              .single();

          if (spreadsheetError) {
            console.error(
              "Spreadsheet creation error:",
              spreadsheetError
            );

            //setShowUploadPanel(false)
            return;
          }


          spreadsheetIDToUse = newSpreadsheet.spreadsheet_id;
          
          console.log(
          "4️⃣ New spreadsheet created:",
          spreadsheetIDToUse
          ) ;

          // Update dropdown after creation
          setSpreadsheetList(prev => [
            ...prev,
            newSpreadsheet
          ]);


          // Select the new spreadsheet
          setSelectedSpreadsheetID(
            newSpreadsheet.spreadsheet_id
          );
        }


        // =========================
        // INSERT CSV ROWS
        // =========================

        const formattedData = results.data.map((row) => ({
          spreadsheet_id: spreadsheetIDToUse,
          spreadsheet_row_data: row,
          spreadsheet_row_processed: false
        }));

      try{

        console.log(
        "5️⃣ Data ready for spreadsheet_row:",
        formattedData.length
         );

         console.log(
        "Example row:",
        formattedData[0]
      );
        console.log(formattedData);


        const { data: insertedRows,error } = await supabase
          .from("spreadsheet_row")
          .insert(formattedData)
          .select();

        console.log("6️⃣ Insert finished");

        if (error) {

          console.error(
            "Row insert error:",
            error
          );

        } else {

          console.log(
            "CSV uploaded successfully" + insertedRows
          );

          setShowUploadPanel(false);
          setSelectedFile(null);
        }
      } catch(err) {
        console.error(
            "🔥 Unexpected insert failure:",
            err
          );

      }


      },
    });
};

  async function toggleProcessed(id, current) {
      await supabase
        .from("spreadsheet_row")
        .update({ processed: !current })
        .eq("id", id);
  
      // Refresh UI
      setRows(rows.map((r) => (r.id === id ? { ...r, processed: !current } : r)));
  }

  return (

  <div className="p-6">

    {/* HEADER */}
    <div className="flex items-start">
      {/* LOGO */}
      <div className="flex items-start">        
        <Link href="/">
          <Image
            src="/hatlogo.png"
            alt="Trekgeest logo"
            width={150}
            height={150}
            style={{ height: "auto" }}
            className="object-contain -mr-6 -mt-4"
            priority
          />                     
        </Link>
        <h1 className="--font-inter text-5xl">spreadsheets</h1>
      </div>

      {/* UPLOAD BUTTON (placeholder) */}
      <div className="flex flex-col flex-1  justify-top items-end bg-white font-inter dark:bg-black pr-10">
        <div className="mb-4">
          {!showUploadPanel ? (
            <button
              onClick={() => setShowUploadPanel(true)}
              className="bg-[#c06a4d] text-white px-4 py-2 rounded-md"
            >
              Upload CSV
            </button>
          ) : (
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="font-semibold mb-3">
                Upload Spreadsheet
              </h3>
              {/* MODE */}
              <div className="mb-3">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="existing"
                    checked={mode === "existing"}
                    onChange={() => setMode("existing")}
                  />
                  {" "}Existing
                </label>
                <label>
                  <input
                    type="radio"
                    value="new"
                    checked={mode === "new"}
                    onChange={() => setMode("new")}
                  />
                  {" "}New
                </label>
              </div>
              {/* CONDITIONAL UI */}
              {mode === "new" ? (
                <input
                  type="text"
                  placeholder="Spreadsheet name"
                  value={newSpreadsheetName}
                  onChange={(e) =>
                    setNewSpreadsheetName(e.target.value)
                  }
                  className="border p-2 rounded-md w-full mb-3"
                />
              ) : (
                <select
                  value={selectedSpreadsheetID}
                  onChange={(e) => 
                    setSelectedSpreadsheetID(e.target.value)
                  }
                  className="border p-2 rounded-md w-full mb-3"
                >
                  {spreadsheetList.map((sheet) => (
                    <option
                      key={sheet.spreadsheet_id}
                      value={sheet.spreadsheet_id}
                    >
                      {sheet.spreadsheet_name}
                    </option>
                  ))}
                </select>

              )}
              {/* FILE INPUT */}
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="mb-3 bg-[#c06a4d] px-2 py-2 rounded-md"
              />
              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() =>{ 
                    setShowUploadPanel(false)
                    setSelectedFile(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                  className="bg-[#c06a4d] px-4 py-2 rounded-md"
                >
                  Import
                </button>  
              </div>
            </div>
          )}
      </div>
      
      {/* DROPDOWN (future-ready) */}
      <div className="mb-4">
        <select
          value={selectedSpreadsheetID}
          onChange={(e) => setSelectedSpreadsheetID(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          {spreadsheetList.map((sheet) => (
            <option
              key={sheet.spreadsheet_id}
              value={sheet.spreadsheet_id}
            >
              {sheet.spreadsheet_name}
            </option>
          ))}
        </select>
      </div>
    </div>
    </div>

    {/* SPREADSHEET AREA */}
    <div className="flex flex-col flex-1 items-center justify-center py-10 pl-10 pr-10  bg-white font-inter dark:bg-black">
    {!hasSpreadsheetDataLoaded ? (    
       <Loader />
      ) : (                
          <SpreadsheetTable spreadsheetdataName={spreadsheetName}
          spreadsheetColumns={columns}
          spreadsheetRows = {rows}
          handleAddToPeopleDB={handleAddToPeopleDB}   />    
     )}
    </div>

  </div>
  );
}
