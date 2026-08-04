import { supabase } from "../../lib/supabase"
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
        <h1 className="--font-inter text-5xl leading-tight">
          trekgeest genealogy
        </h1>
      </div>
     
      <p className="--font-inter flex flex-col items-center text-3xl "> Tools and Information Mapping of Gordonia Basters</p>
      <div className="flex flex-row justify-center items-center gap-8 py-10">    
          <Link href="/spreadsheets">
              <button className="bg-[#c06a4d] text-white px-6 py-3 rounded-md">
                Go to Spreadsheets
              </button>
          </Link>
          <Link href="/peopledatabase">
              <button className="bg-[#c06a4d] text-white px-6 py-3 rounded-md">
                Go to People Database
              </button>
          </Link>
          <Link href="/exploredna">
              <button className="bg-[#c06a4d] text-white px-6 py-3 rounded-md">
                Explore DNA
              </button>
          </Link>                   
      </div>
    </div>
  );
}