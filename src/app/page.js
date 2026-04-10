import { supabase } from "../../lib/supabase"
import SpreadsheetTable from "./components/SpreadsheetTable";


export default function Page() {
  return (
    <div>
      <SpreadsheetTable spreadsheetdataName="VGKChurchUpington" />
    </div>
  );
}