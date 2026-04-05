import { supabase } from "../../lib/supabase"
import SpreadsheetTable from "./SpreadsheetTable";


export default function Page() {
  return (
    <div>
      <SpreadsheetTable spreadsheetdataName="VGKChurchUpington" />
    </div>
  );
}