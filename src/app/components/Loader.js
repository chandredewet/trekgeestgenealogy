"use client"; // ← This makes it a Client Component

export default function Loader () {
  
   return (
     <ul className="max-w-md space-y-3 text-body list-inside text-center">
        <li className="flex items-center py-8 justify-center gap-4"><span className="loader"></span></li>
        <li className="flex items-center py-8 justify-center gap-4">           
          Retrieving Information
        </li>
      </ul>  
  );
}