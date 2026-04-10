export default function HatLogo({ className = "h-10 w-auto text-[#c06a4d]" }) {
  return (
    <svg
      viewBox="0 0 512 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer brim (main silhouette) */}
        <path d="M30 170 
                 C 120 230, 390 230, 480 165 
                 C 420 195, 90 195, 30 170 Z" />

        {/* Inner brim line */}
        <path d="M60 165 
                 C 150 200, 360 200, 450 160" />

        {/* Crown base */}
        <path d="M170 165 
                 C 150 95, 360 95, 340 165" />

        {/* Crown top contour */}
        <path d="M185 115 
                 C 210 70, 300 70, 325 115" />

        {/* Crown dents */}
        <path d="M215 115 
                 C 235 95, 275 95, 295 115" />

        {/* Hat band */}
        <path d="M175 160 L335 160" />
      </g>
    </svg>
  );
}