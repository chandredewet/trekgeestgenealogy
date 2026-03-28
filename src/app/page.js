import { supabase } from "../../lib/supabase"
import SpreadsheetTable from "./SpreadsheetTable";


export default function Page() {
  return (
    <div>
      <h1>VGK Baptisms</h1>
      <SpreadsheetTable spreadsheetName="VGK Baptisms" />
    </div>
  );
}