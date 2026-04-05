"use client"; // ← This makes it a Client Component
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // adjust path

export default function SpreadsheetTable({ spreadsheetdataName }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hasSpreadsheetDataLoaded, setHasSpreadsheetDataLoaded] =
    useState(false);

  useEffect(() => {
    console.log("Effect running", spreadsheetdataName);
    async function fetchData() {
      const { data, error } = await supabase
        .from("spreadsheetdata")
        .select("*")
        .eq("spreadsheetdataName", spreadsheetdataName);

      if (error) {
        console.error("Supabase error:", error);
        setHasSpreadsheetDataLoaded(true); // still stop loader
        return;
      }

      const mappedRows = data.map(r => ({
        ...r.spreadsheetdataData,
        spreadsheetdataID: r.spreadsheetdataID,
        spreadsheetdataProcessed: r.spreadsheetdataProcessed
      }));

      setRows(mappedRows);

      const cols =
        data.length > 0
          ? Object.keys(data[0].spreadsheetdataData)
          : [];

      setColumns(cols);
      // setColumns(mappedRows.length > 0 ? Object.keys(mappedRows[0]) : []);
      setHasSpreadsheetDataLoaded(true);
      console.log(mappedRows)
    }

    fetchData();

    console.log("Effect running", spreadsheetdataName);
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
    <div className="flex flex-col flex-1 items-center justify-center px-10 py-10  bg-white font-sans dark:bg-black">
      <h1>VGK Baptisms</h1>

      {!hasSpreadsheetDataLoaded ? (
        <ul className="max-w-md space-y-3 text-body list-inside text-center">
          <li className="flex items-center py-8 justify-center gap-4">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            Retrieving Information
          </li>
        </ul>
      ) : (
        <main className="flex flex-1 w-full max-w-none flex-col items-center py-10   bg-zinc-50 dark:bg-black sm:items-start">
          <div className="max-h-64 overflow-y-auto w-full overflow-x-auto border border-gray-300">
            <table className="min-w-full table-auto border-collapse">
              <thead className=" bg-gray-100 px-10 sticky top-0">
                <tr>
                  <th className="border align-top px-6 py-2">
                    Processed
                  </th>
                  <th className="border align-top px-6 py-2">
                    Spreadsheet ID
                  </th>
                  {columns.map((col) => (
                    <th
                      className="border  align-top  text-left whitespace-nowrap px-3 py-2"
                      key={col}
                    >
                      {col}
                    </th>
                  ))}                  
                </tr>
              </thead>
              <tbody className="px-10 top-0">
                {rows.length > 0 ? (
                  rows.map((row, idx) => (
                    <tr
                      className="border  align-top px-3 py-2 white"
                      key={idx}
                    >
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={row.spreadsheetdataProcessed || false}
                          onChange={() =>
                            toggleProcessed(
                              row.spreadsheetdataID,
                              row.spreadsheetdataProcessed,
                            )
                          }
                        />
                      </td>
                      {/* <th className="border align-top px-6 py-2">
                    Processed
                  </th> */}
                      <td className="text-center">
                        {row.spreadsheetdataID}
                      </td>
                      {columns.map((col) => (
                        <td key={col} className="text-center px-3">{row[col]}</td>
                      ))}
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1}>No rows to display</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </div>
  );
}
