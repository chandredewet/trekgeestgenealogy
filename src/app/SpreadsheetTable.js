"use client"; // ← This makes it a Client Component
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // adjust path

export default function SpreadsheetTable({ spreadsheetdataName }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("spreadsheetdata")
        .select("*")
        .eq("spreadsheetdataName", spreadsheetdataName);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const mappedRows = data.map(r => r.data);
      setRows(mappedRows);
      setColumns(mappedRows.length > 0 ? Object.keys(mappedRows[0]) : []);
    }

    fetchData();
  }, [spreadsheetdataName]);

  async function toggleProcessed(id, current) {
    await supabase
      .from("spreadsheetdata")
      .update({ processed: !current })
      .eq("id", id);

    // Refresh UI
    setRows(rows.map(r => (r.id === id ? { ...r, processed: !current } : r)));
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => <th key={col}>{col}</th>)}
          <th>Processed</th>
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => <td key={col}>{row[col]}</td>)}
              <td>
                <input
                  type="checkbox"
                  checked={row.processed || false}
                  onChange={() => toggleProcessed(row.id, row.processed)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={columns.length + 1}>No rows to display</td></tr>
        )}
      </tbody>
    </table>
  );
}