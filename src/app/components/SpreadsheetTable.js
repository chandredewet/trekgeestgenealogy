"use client"; // ← This makes it a Client Component
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // adjust path

export default function SpreadsheetTable({ spreadsheetdataName, spreadsheetColumns, spreadsheetRows }) {
  
   return (
     <div className="flex flex-1 w-full max-w-none flex-col items-center dark:bg-black sm:items-start">
        <h2 className="--font-inter text-3xl items-end">{spreadsheetdataName}</h2>
        {/* TABLE */}
        <div className="w-full overflow-hidden border border-gray-200 rounded-2xl shadow-sm">          
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
                      <input
                        type="checkbox"
                        checked={row.spreadsheetdataProcessed || false}
                        readOnly
                      />
                    </td>
                    {/* SpreadSheetID */}
                    <td className="px-4 py-2 text-center ">
                      {row.spreadsheetdataID}
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