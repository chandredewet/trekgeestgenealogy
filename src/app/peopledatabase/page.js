"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import SpreadsheetTable from "../components/SpreadsheetTable";
import PeopleDatabaseSetup from "../components/PeopleDatabaseSetup";
import Loader from "../components/Loader";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";


export default function PeopleDatabasePage() {
  
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hasSpreadsheetDataLoaded, setHasSpreadsheetDataLoaded] = useState(false);
  const [peopleDatabaseList, setPeopleDatabaseList] = useState([]);

  const [selectedPeopleDatabaseID, setSelectedPeopleDatabaseID] =
    useState("");

  const [hasPeopleDatabaseLoaded, setHasPeopleDatabaseLoaded] =
    useState(false);

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

  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const availableFields = [
  "First Name",
  "Surname",
  "Birth Date",
  "Baptism Date",
  "Father",
  "Mother",
  "Witness",
  "Minister",
  "Page",
  "Entry Number"
  ];

  const [selectedFields, setSelectedFields] = useState([]);

  const fetchPeopleDatabases = async () => {
    setHasPeopleDatabaseLoaded(false);

    const { data, error } = await supabase
      .from("people_database")
      .select("*");

    if (error) {
      console.error(
        "People Database fetch error:",
        error
      );

      setHasPeopleDatabaseLoaded(true);
      return;
    }

    setPeopleDatabaseList(data || []);

    if (data && data.length > 0) {
      setSelectedPeopleDatabaseID(
        data[0].people_database_id
      );
    }

    setHasPeopleDatabaseLoaded(true);
  };

  const fetchSpreadsheet = async () => {

      const fetchSpreadsheetColumns = async () => {
      
        if (!selectedSpreadsheetID) {
          setAvailableColumns([]);
          setSelectedColumns([]);
          return;
        }

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
  }

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
    fetchPeopleDatabases();
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
          <h1 className="--font-inter text-5xl">people database</h1>     
        </div>    
      </div> 

      
      {!hasPeopleDatabaseLoaded ? ( 
        <div className="flex flex-col flex-1 items-center justify-center py-10 pl-10 pr-10  bg-white font-inter dark:bg-black">   
        <Loader />
        
       </div>
      ) : peopleDatabaseList.length === 0 ? (
        <PeopleDatabaseSetup
          onDatabaseCreated={fetchPeopleDatabases}
        />
      ) : (
      // <PeopleDatabaseView />

      // {/* SPREADSHEET AREA */}  
                     
      <SpreadsheetTable 
      spreadsheetdataName={spreadsheetName}
      spreadsheetColumns={columns}
      spreadsheetRows = {rows}
      handleAddToPeopleDB={handleAddToPeopleDB}   />  

      
      )}

          
     
    </div>  
  );
}