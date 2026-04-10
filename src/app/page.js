import { supabase } from "../../lib/supabase"
import SpreadsheetTable from "./components/SpreadsheetTable";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col items-center  gap-1 py-20 ">
        <Image
          src="/hatlogo.png"
          alt="Trekgeest logo"
          width={150}
          height={150}
          className="object-contain"
          priority
        />
        <h1 className="--font-google-sans text-5xl leading-tight">
          trekgeest genealogy
        </h1>
      </div>
     
     <p className="--font-google-sans flex flex-col items-center text-3xl "> Tools and Information Mapping of Gordonia Basters</p>

     <ul className="max-w-md space-y-3 text-body list-inside text-center">
             
             <li className="flex items-center py-8 justify-center gap-4">           
              <Link href="/spreadsheets">
  <button className="bg-[#c06a4d] text-white px-6 py-3 rounded-md">
    Go to Spreadsheets
  </button>
</Link>
             </li>
           </ul> 

    </div>
  );
}