"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function PeopleDatabaseSetup({
  onDatabaseCreated
}) {

  const [showCreatePanel, setShowCreatePanel] =
    useState(false);

  const [spreadsheetList, setSpreadsheetList] =
    useState([]);

  const [selectedSpreadsheetID, setSelectedSpreadsheetID] =
    useState("");

  const [availableFields, setAvailableFields] =
    useState([]);

  const [selectedFields, setSelectedFields] =
    useState([]);

  // ========================================
  // TEMPORARY DATABASE COLUMNS
  // Nothing is saved to Supabase yet
  // ========================================

  const [databaseColumns, setDatabaseColumns] =
    useState([]);

  const [creating, setCreating] =
    useState(false);


  // =========================
  // FETCH SPREADSHEETS
  // =========================

  useEffect(() => {
    fetchSpreadsheets();
  }, []);


  async function fetchSpreadsheets() {

    const { data, error } = await supabase
      .from("spreadsheet")
      .select(
        "spreadsheet_id, spreadsheet_name"
      );

    if (error) {
      console.error(
        "Spreadsheet fetch error:",
        error
      );
      return;
    }

    setSpreadsheetList(data || []);
  }


  // =========================
  // FETCH FIELDS FROM
  // SELECTED SPREADSHEET
  // =========================

  useEffect(() => {

    if (!selectedSpreadsheetID) {
      setAvailableFields([]);
      setSelectedFields([]);
      return;
    }

    fetchSpreadsheetFields();

  }, [selectedSpreadsheetID]);


  async function fetchSpreadsheetFields() {

    const { data, error } = await supabase
      .from("spreadsheet_row")
      .select("spreadsheet_row_data")
      .eq(
        "spreadsheet_id",
        selectedSpreadsheetID
      )
      .limit(1);

    if (error) {
      console.error(
        "Field fetch error:",
        error
      );
      return;
    }

    if (
      data &&
      data.length > 0 &&
      data[0].spreadsheet_row_data
    ) {

      const fields = Object.keys(
        data[0].spreadsheet_row_data
      );

      setAvailableFields(fields);

    } else {

      setAvailableFields([]);

    }

    // Clear selections when changing spreadsheet
    setSelectedFields([]);
  }


  // =========================
  // ADD SELECTED FIELDS
  // TO TEMPORARY DATABASE
  // =========================

  function addSelectedFields() {

    if (selectedFields.length === 0) {
      return;
    }

    const selectedSpreadsheet =
      spreadsheetList.find(
        (sheet) =>
          sheet.spreadsheet_id ===
          selectedSpreadsheetID
      );

    const newColumns =
      selectedFields
        .filter((field) => {

          // Prevent duplicate fields
          return !databaseColumns.some(
            (column) =>
              column.sourceField === field &&
              column.spreadsheetID ===
                selectedSpreadsheetID
          );

        })
        .map((field) => ({

          // Original spreadsheet field
          sourceField: field,

          // The name shown in People Database
          columnName: field,

          // Remember where it came from
          spreadsheetID:
            selectedSpreadsheetID,

          spreadsheetName:
            selectedSpreadsheet?.spreadsheet_name
              ?? ""

        }));


    setDatabaseColumns([
      ...databaseColumns,
      ...newColumns
    ]);


    // Clear current checkboxes
    setSelectedFields([]);
  }


  // =========================
  // RENAME COLUMN
  // =========================

  function renameColumn(index, newName) {

    setDatabaseColumns(
      databaseColumns.map(
        (column, columnIndex) =>

          columnIndex === index
            ? {
                ...column,
                columnName: newName
              }
            : column

      )
    );

  }


  // =========================
  // MOVE COLUMN UP
  // =========================

  function moveColumnUp(index) {

    if (index === 0) return;

    const updatedColumns =
      [...databaseColumns];

    [
      updatedColumns[index - 1],
      updatedColumns[index]
    ] = [
      updatedColumns[index],
      updatedColumns[index - 1]
    ];

    setDatabaseColumns(
      updatedColumns
    );

  }


  // =========================
  // MOVE COLUMN DOWN
  // =========================

  function moveColumnDown(index) {

    if (
      index ===
      databaseColumns.length - 1
    ) {
      return;
    }

    const updatedColumns =
      [...databaseColumns];

    [
      updatedColumns[index],
      updatedColumns[index + 1]
    ] = [
      updatedColumns[index + 1],
      updatedColumns[index]
    ];

    setDatabaseColumns(
      updatedColumns
    );

  }


  // =========================
  // REMOVE COLUMN
  // =========================

  function removeColumn(index) {

    setDatabaseColumns(
      databaseColumns.filter(
        (_, columnIndex) =>
          columnIndex !== index
      )
    );

  }


  // =========================
  // FINAL CREATE DATABASE
  // =========================

  async function createPeopleDatabase() {

    if (databaseColumns.length === 0) {
      console.log(
        "Please add at least one column"
      );
      return;
    }

    setCreating(true);


    // IMPORTANT:
    // We will add your actual Supabase
    // database insert here next.
    //
    // At this point databaseColumns contains:
    //
    // sourceField
    // columnName
    // spreadsheetID
    // spreadsheetName
    //
    // and the array order is the column order.

    console.log(
      "Creating People Database with:",
      databaseColumns
    );


    /*
    ==================================

    LATER:

    1. Create people_database

    2. Get new people_database_id

    3. Insert every databaseColumns item
       into your people database columns table

    4. Save the index as the column order

    ==================================
    */


    setCreating(false);

    // Don't call this yet until the
    // actual Supabase insert is added.

    // onDatabaseCreated();

  }


  // =========================
  // INITIAL BUTTON
  // =========================

  if (!showCreatePanel) {

    return (

      <div className="py-8">

        <p className="mb-3">
          No People Database has been created yet.
        </p>

        <button
          onClick={() =>
            setShowCreatePanel(true)
          }
          className="
            bg-[#c06a4d]
            text-white
            px-4
            py-2
            rounded-md
          "
        >
          Create People Database
        </button>

      </div>

    );

  }


  // =========================
  // CREATE DATABASE PANEL
  // =========================

  return (

    <div className="
      py-8
      max-w-2xl
      space-y-6
    ">


      {/* =====================
          HEADING
      ====================== */}

      <h2 className="
        text-xl
        font-semibold
      ">
        Create People Database
      </h2>


      {/* =====================
          SPREADSHEET DROPDOWN
      ====================== */}

      <div>

        <label className="
          block
          mb-2
        ">
          Choose spreadsheet
        </label>


        <select
          value={selectedSpreadsheetID}
          onChange={(e) =>
            setSelectedSpreadsheetID(
              e.target.value
            )
          }
          className="
            border
            px-3
            py-2
            rounded-md
            w-full
          "
        >

          <option value="">
            Select a spreadsheet
          </option>


          {spreadsheetList.map(
            (sheet) => (

              <option
                key={
                  sheet.spreadsheet_id
                }
                value={
                  sheet.spreadsheet_id
                }
              >
                {sheet.spreadsheet_name}
              </option>

            )
          )}

        </select>

      </div>


      {/* =====================
          FIELD SELECTION
      ====================== */}

      {availableFields.length > 0 && (

        <div>

          <p className="mb-2">
            Select fields to add
          </p>


          <div className="
            space-y-2
            border
            rounded-md
            p-4
          ">

            {availableFields.map(
              (field) => (

                <label
                  key={field}
                  className="
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                  "
                >

                  <input
                    type="checkbox"
                    value={field}
                    checked={
                      selectedFields.includes(
                        field
                      )
                    }
                    onChange={(e) => {

                      if (e.target.checked) {

                        setSelectedFields([
                          ...selectedFields,
                          field
                        ]);

                      } else {

                        setSelectedFields(
                          selectedFields.filter(
                            (selected) =>
                              selected !== field
                          )
                        );

                      }

                    }}
                  />

                  <span>
                    {field}
                  </span>

                </label>

              )
            )}

          </div>


          {/* ADD FIELDS BUTTON */}

          <button
            onClick={addSelectedFields}
            disabled={
              selectedFields.length === 0
            }
            className="
              mt-3
              bg-[#c06a4d]
              text-white
              px-4
              py-2
              rounded-md
            "
          >
            Add Selected Fields
          </button>

        </div>

      )}


      {/* =====================
          DATABASE COLUMNS
          BEING BUILT
      ====================== */}

      {databaseColumns.length > 0 && (

        <div>

          <h3 className="
            text-lg
            font-semibold
            mb-3
          ">
            People Database Columns
          </h3>


          <div className="
            border
            rounded-md
            overflow-hidden
          ">


            {databaseColumns.map(
              (column, index) => (

                <div
                  key={
                    `${column.spreadsheetID}-${column.sourceField}`
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    border-b
                  "
                >


                  {/* ORDER NUMBER */}

                  <span className="
                    w-6
                    text-center
                  ">
                    {index + 1}
                  </span>


                  {/* ORIGINAL FIELD */}

                  <div className="
                    w-32
                    text-sm
                  ">

                    <div>
                      {column.sourceField}
                    </div>

                    <div className="
                      text-xs
                      text-gray-500
                    ">
                      {column.spreadsheetName}
                    </div>

                  </div>


                  {/* RENAME COLUMN */}

                  <input
                    type="text"
                    value={
                      column.columnName
                    }
                    onChange={(e) =>
                      renameColumn(
                        index,
                        e.target.value
                      )
                    }
                    className="
                      border
                      px-2
                      py-1
                      rounded-md
                      flex-1
                    "
                  />


                  {/* MOVE UP */}

                  <button
                    onClick={() =>
                      moveColumnUp(index)
                    }
                    disabled={index === 0}
                    className="
                      border
                      px-2
                      py-1
                      rounded-md
                    "
                    title="Move up"
                  >
                    ↑
                  </button>


                  {/* MOVE DOWN */}

                  <button
                    onClick={() =>
                      moveColumnDown(index)
                    }
                    disabled={
                      index ===
                      databaseColumns.length - 1
                    }
                    className="
                      border
                      px-2
                      py-1
                      rounded-md
                    "
                    title="Move down"
                  >
                    ↓
                  </button>


                  {/* REMOVE */}

                  <button
                    onClick={() =>
                      removeColumn(index)
                    }
                    className="
                      border
                      px-2
                      py-1
                      rounded-md
                    "
                    title="Remove"
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =====================
          FINAL ACTIONS
      ====================== */}

      <div className="
        flex
        gap-2
        pt-2
      ">

        <button
          onClick={() =>
            setShowCreatePanel(false)
          }
          className="
            bg-gray-300
            px-4
            py-2
            rounded-md
          "
        >
          Cancel
        </button>


        <button
          onClick={createPeopleDatabase}
          disabled={
            creating ||
            databaseColumns.length === 0
          }
          className="
            bg-[#c06a4d]
            text-white
            px-4
            py-2
            rounded-md
          "
        >

          {creating
            ? "Creating..."
            : "Create People Database"}

        </button>

      </div>

    </div>

  );

}