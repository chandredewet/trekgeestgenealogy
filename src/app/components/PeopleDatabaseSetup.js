import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function PeopleDatabaseSetup({onDatabaseCreated}) {
  const [peopleDatabase, setPeopleDatabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
 

  

  

  return (
    <div className="space-y-4 py-8 ">
      
        {!showCreatePanel ? (
        <div>
          <p className="mb-3">
            No People Database has been created yet.
          </p>

          <button
            onClick={() =>
            setShowCreatePanel(true)
          }
            disabled={creating}
            className="bg-[#c06a4d] text-white px-4 py-2 rounded-md"
          >
            
          Create People Database
          </button>
        </div>
      ) : (
        <div>
          <p>People Database exists.</p>

          {/* Next component goes here */}
        </div>
      )}
    </div>
  );
}