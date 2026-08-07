"use client"; // ← This makes it a Client Component
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // adjust path

export default function SpreadsheetTable({ spreadsheetdataName, spreadsheetColumns, spreadsheetRows,   handleAddToPeopleDB }) {
  
  

   return (
     <div className="flex flex-1 w-full max-w-none flex-col items-center dark:bg-black sm:items-start">
        <h2 className="--font-inter text-3xl items-end py-5">{spreadsheetdataName}</h2>
        {/* TABLE */}
        {/* PROCESS TRACKER */}
    <div className="w-full mb-5">

      <div className="flex justify-between mb-2">
        <span>
          Processed: {
            spreadsheetRows.filter(
              row => row.spreadsheetRowProcessed
            ).length
          } / {spreadsheetRows.length}
        </span>

        <span>
          {
            Math.round(
              (spreadsheetRows.filter(
                row => row.spreadsheetRowProcessed
              ).length / spreadsheetRows.length) * 100
            )
          }%
        </span>
      </div>


      <div className="h-3 bg-gray-200 rounded-full">
        <div
          className="h-3 bg-[#c06a4d] rounded-full"
          style={{
            width: `${
              Math.round(
                (spreadsheetRows.filter(
                  row => row.spreadsheetRowProcessed
                ).length / spreadsheetRows.length) * 100
              )
            }%`
          }}
        />
      </div>

    </div>
        {/* className="border px-3 py-2 rounded-md" */}
        <div className="w-full overflow-hidden border rounded-2xl shadow-sm">
        {/* <div className="w-full overflow-hidden border border-gray-200 rounded-2xl shadow-sm">           */}
          
          <div className="max-h-[500px] overflow-auto scroll-smooth ">    
            <table className="min-w-max text-sm border-collapse">

              {/* HEADER */}
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#c06a4d] text-white px-10">

                  {/* Processed FIRST */}
                  <th className="align-top px-4 py-3 text-center  font-semibold ">
                    Processed
                  </th>
                  <th className="align-top px-4 py-3 text-center font-semibold ">
                      Spreadsheet ID
                  </th>
                  {spreadsheetColumns.map((col) => (
                    <th
                      key={col}
                      className="align-top px-4 py-3 text-center font-semibold 
                      "   
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* BODY */}
              <tbody>
                {spreadsheetRows.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50 transition align-center">
                    
                    {/* Processed */}
                    <td className="px-4 py-2 text-center ">
                      <button
                        onClick={() => handleAddToPeopleDB(row)}
                        disabled={row.spreadsheetRowProcessed}
                        title={
                          row.spreadsheetRowProcessed
                            ? "Already added to People Database"
                            : "Add to People Database"
                        }
                        className={`
                          mx-auto
                          w-8 h-8 rounded-full border flex items-center justify-center
                          transition
                          ${
                            row.spreadsheetRowProcessed
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }
                        `}
                      >
                        {row.spreadsheetRowProcessed ? "✓" : "+"}
                      </button>
                    </td>
                    {/* SpreadSheetID */}
                    <td className="px-4 py-2 text-center ">
                      {row.spreadsheetRowID}
                    </td>

                    {/* Dynamic columns */}
                    {spreadsheetColumns.map((col) => (
                      <td key={col} className="text-center px-4 py-2  text-gray-700 ">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>    
      </div>        
  );
}