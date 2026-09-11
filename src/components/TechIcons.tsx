import React from "react";

interface TechIconProps {
  name: string;
  size?: number;
}

export function TechIcon({ name, size = 32 }: TechIconProps) {
  const n = name.toLowerCase();

  // Python: Authentic blue and yellow snakes with eyes
  if (n.includes("python")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M63.5 8C38.2 8 39.8 19 39.8 19L39.8 30.3H64.2V33.8H29.5C18.6 33.8 8.8 40.5 8.8 62.6C8.8 84.8 18.3 84.4 18.3 84.4H28.4V70.3C28.4 53.7 42.6 54.3 42.6 54.3H66.9C80.2 54.3 81.3 43.8 81.3 43.8V19.4C81.3 19.4 83.1 8 63.5 8ZM51.7 17.6C54.7 17.6 57.1 20 57.1 23C57.1 26 54.7 28.4 51.7 28.4C48.7 28.4 46.3 26 46.3 23C46.3 20 48.7 17.6 51.7 17.6Z"
          fill="#3776AB"
        />
        <path
          d="M64.5 120C89.8 120 88.2 109 88.2 109V97.7H63.8V94.2H98.5C109.4 94.2 119.2 87.5 119.2 65.4C119.2 43.2 109.7 43.6 109.7 43.6H99.6V57.7C99.6 74.3 85.4 73.7 85.4 73.7H61.1C47.8 73.7 46.7 84.2 46.7 84.2V108.6C46.7 108.6 44.9 120 64.5 120ZM76.3 110.4C73.3 110.4 70.9 108 70.9 105C70.9 102 73.3 99.6 76.3 99.6C79.3 99.6 81.7 102 81.7 105C81.7 108 79.3 110.4 76.3 110.4Z"
          fill="#FFD438"
        />
      </svg>
    );
  }

  // React: Official atomic nucleus and 3 orbits
  if (n === "react" || (n.includes("react") && !n.includes("native"))) {
    return (
      <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Next.js: Official black badge with white N and gradient trail
  if (n.includes("next")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="64" fill="#000000" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        <path
          d="M87.5 91.5L46.8 38H39V90H47.4V52.8L82.1 98.4C83.9 96.3 85.8 93.9 87.5 91.5Z"
          fill="url(#next_grad)"
        />
        <rect x="80" y="38" width="8.4" height="34" fill="#FAFAFA" />
        <defs>
          <linearGradient id="next_grad" x1="68" y1="67" x2="88" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // TypeScript: Official TS blue square badge
  if (n.includes("typescript")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="16" fill="#3178C6" />
        <path
          d="M59.2 59.4H47.1V102H35.8V59.4H23.7V50.2H59.2V59.4ZM103.5 69.2C103.5 65.5 102.1 62.4 99.3 60C96.5 57.6 92.4 56 86.8 55.2L81.2 54.4C77.4 53.9 74.6 53 72.9 51.8C71.2 50.6 70.3 49 70.3 47C70.3 44.8 71.3 43.1 73.3 41.8C75.3 40.5 78.1 39.9 81.7 39.9C85.3 39.9 88.2 40.6 90.3 42C92.4 43.4 93.7 45.4 94.2 48.2L104.4 44.1C103.4 39.7 100.9 36.1 96.9 33.3C92.9 30.5 87.8 29.1 81.6 29.1C74.6 29.1 68.9 30.8 64.5 34.2C60.1 37.6 57.9 42.1 57.9 47.7C57.9 52.3 59.4 56.1 62.4 59C65.4 61.9 69.7 63.8 75.3 64.7L81.5 65.7C85.8 66.4 88.9 67.4 90.8 68.8C92.7 70.2 93.7 72.1 93.7 74.5C93.7 77.2 92.5 79.3 90.1 80.8C87.7 82.3 84.3 83.1 79.9 83.1C75.3 83.1 71.7 82.1 69.1 80.1C66.5 78.1 64.8 75.1 64 71.1L53.4 75.2C54.7 81.2 57.7 85.9 62.4 89.3C67.1 92.7 73.1 94.4 80.4 94.4C88 94.4 94.1 92.7 98.7 89.3C103.3 85.9 105.6 81.1 105.6 74.9V69.2H103.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Node.js: Official green hexagon and node mark
  if (n.includes("node")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M64 12L110 38.5V91.5L64 118L18 91.5V38.5L64 12Z"
          fill="#539E43"
        />
        <path
          d="M64 22L101 43.5V86.5L64 108L27 86.5V43.5L64 22Z"
          fill="#333333"
        />
        <path
          d="M64 36L86 48.7V74.3L64 87L42 74.3V48.7L64 36Z"
          fill="#539E43"
        />
        <circle cx="64" cy="61.5" r="7" fill="#FFFFFF" />
      </svg>
    );
  }

  // FastAPI / Flask: Teal circle with lightning bolt and beaker
  if (n.includes("fastapi") || n.includes("flask")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="58" fill="#009688" />
        <path
          d="M68 22L36 68H62L58 106L92 58H66L68 22Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // C / C++: Official C blue hexagon shield
  if (n === "c" || n.includes("c / c++") || n.includes("c++")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M64 14L108 39V89L64 114L20 89V39L64 14Z"
          fill="#00599C"
        />
        <path
          d="M64 24L99 44V84L64 104L29 84V44L64 24Z"
          fill="#004482"
        />
        <path
          d="M78 47C74.6 44 70 42.5 64.2 42.5C52.5 42.5 44 51.5 44 64C44 76.5 52.5 85.5 64.2 85.5C70 85.5 74.6 84 78 81L73 72.5C70.6 74.5 67.5 75.5 64.2 75.5C57.5 75.5 53.5 70.5 53.5 64C53.5 57.5 57.5 52.5 64.2 52.5C67.5 52.5 70.6 53.5 73 55.5L78 47Z"
          fill="#FFFFFF"
        />
        <path
          d="M86 58H92V52H96V58H102V62H96V68H92V62H86V58ZM98 70H104V64H108V70H114V74H108V80H104V74H98V70Z"
          fill="#659AD2"
        />
      </svg>
    );
  }

  // HTML5 / CSS3: Official orange HTML5 shield
  if (n.includes("html")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 14L29 114L64 124L99 114L109 14H19Z" fill="#E44D26" />
        <path d="M64 23V114L90.5 106.5L98.5 23H64Z" fill="#F16529" />
        <path
          d="M64 43H45L46.5 58H64V73H48L49.5 88L64 92V104L40 97L36 31H64V43ZM64 43H83L81.5 58H64V73H80L78 92L64 96V108L88 101L92 31H64V43Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // PostgreSQL: Official blue elephant silhouette
  if (n.includes("postgresql") || (n.includes("sql") && !n.includes("optimization"))) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="20" fill="#336791" />
        <path
          d="M64 22C46 22 34 33 34 49C34 59.5 40 68 47 72.5V88C47 91.5 49 94 53 95C57 96 61 93 61 89V75H67V89C67 93 71 96 75 95C79 94 81 91.5 81 88V72.5C88 68 94 59.5 94 49C94 33 82 22 64 22ZM54 44C57.3 44 60 46.7 60 50C60 53.3 57.3 56 54 56C50.7 56 48 53.3 48 50C48 46.7 50.7 44 54 44ZM74 44C77.3 44 80 46.7 80 50C80 53.3 77.3 56 74 56C70.7 56 68 53.3 68 50C68 46.7 70.7 44 74 44Z"
          fill="#FFFFFF"
        />
        <path
          d="M64 58C60 58 57 61 57 65C57 69 60 72 64 72C68 72 71 69 71 65C71 61 68 58 64 58Z"
          fill="#336791"
        />
      </svg>
    );
  }

  // MongoDB: Official green leaf
  if (n.includes("mongodb")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M64 12C64 12 40 38 40 70C40 88 51 106 63 115C63.6 115.5 64.4 115.5 65 115C77 106 88 88 88 70C88 38 64 12 64 12Z"
          fill="#47A248"
        />
        <path
          d="M64 12C64 12 63.5 13 63.5 13.5V115C63.8 115.2 64.1 115.4 64.5 115.6C64.3 115.4 64.1 115.2 64 115V12Z"
          fill="#3FA037"
        />
        <path
          d="M64 115C63.6 115.5 63 116 63 116L64 115Z"
          fill="#499D4A"
        />
        <path
          d="M64 22V108C74 100 82 85 82 70C82 43 64 22 64 22Z"
          fill="#4DB33D"
        />
        <path
          d="M64 108V22C54 22 46 43 46 70C46 85 54 100 64 108Z"
          fill="#3FA037"
        />
      </svg>
    );
  }

  // Redis: Official stacked red isometric cubes
  if (n.includes("redis")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M64 18L106 38L64 58L22 38L64 18Z"
          fill="#DC382D"
        />
        <path
          d="M22 38L64 58V108L22 88V38Z"
          fill="#A41E11"
        />
        <path
          d="M106 38L64 58V108L106 88V38Z"
          fill="#BD2619"
        />
        <ellipse cx="64" cy="38" rx="16" ry="7" fill="#FFFFFF" fillOpacity="0.4" />
        <ellipse cx="64" cy="58" rx="12" ry="5" fill="#FFFFFF" fillOpacity="0.3" />
      </svg>
    );
  }

  // Supabase: Official emerald green lightning bolt
  if (n.includes("supabase")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M72.5 116.5C70.3 119.5 65.5 118.2 65.2 114.4L62 76.5H18.5C14.2 76.5 12.3 71.1 15.6 68.3L67.5 23.5C69.7 20.5 74.5 21.8 74.8 25.6L78 63.5H121.5C125.8 63.5 127.7 68.9 124.4 71.7L72.5 116.5Z"
          fill="url(#supa_grad)"
        />
        <defs>
          <linearGradient id="supa_grad" x1="15" y1="22" x2="125" y2="117" gradientUnits="userSpaceOnUse">
            <stop stopColor="#249361" />
            <stop offset="1" stopColor="#3ECF8E" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Firebase: Official multi-tone flame
  if (n.includes("firebase")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M26.5 89.5L46 22.5C46.5 20.8 48.8 20.4 49.9 21.8L65 41L26.5 89.5Z"
          fill="#FFA000"
        />
        <path
          d="M26.5 89.5L68 14.5C68.8 13.1 70.8 13.3 71.3 14.9L80 47.5L26.5 89.5Z"
          fill="#F57C00"
        />
        <path
          d="M72 109C72 109 101.5 92.5 101.5 59.5C101.5 57.5 99 56.5 97.8 58L26.5 89.5L58.5 114.5C62.5 117.5 68 117.5 72 109Z"
          fill="#FFCA28"
        />
      </svg>
    );
  }

  // SQL Optimization: Clean database cylinder with query analytics bolt
  if (n.includes("optimization")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="20" fill="rgba(56, 189, 248, 0.1)" stroke="#38BDF8" strokeWidth="3" />
        <ellipse cx="64" cy="36" rx="36" ry="12" fill="#0284C7" />
        <path d="M28 36V62C28 69 44 74 64 74C84 74 100 69 100 62V36" stroke="#38BDF8" strokeWidth="4" fill="none" />
        <path d="M28 62V88C28 95 44 100 64 100C84 100 100 95 100 88V62" stroke="#38BDF8" strokeWidth="4" fill="none" />
        <path d="M68 44L48 76H66L60 100L82 66H66L68 44Z" fill="#FACC15" />
      </svg>
    );
  }

  // Docker: Official blue whale with stacked container cubes
  if (n.includes("docker")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Containers */}
        <g fill="#2496ED">
          <rect x="42" y="36" width="12" height="10" rx="1" />
          <rect x="57" y="36" width="12" height="10" rx="1" />
          <rect x="72" y="36" width="12" height="10" rx="1" />
          <rect x="27" y="49" width="12" height="10" rx="1" />
          <rect x="42" y="49" width="12" height="10" rx="1" />
          <rect x="57" y="49" width="12" height="10" rx="1" />
          <rect x="72" y="49" width="12" height="10" rx="1" />
          <rect x="87" y="49" width="12" height="10" rx="1" />
        </g>
        {/* Whale body */}
        <path
          d="M117 64C114 62 107 62 103 66C98 64 92 63 87 63H15C13 74 19 86 31 92C45 99 74 99 92 90C104 84 112 73 117 64Z"
          fill="#2496ED"
        />
        <circle cx="34" cy="74" r="2.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // Kubernetes: Official 7-spoke ship helm
  if (n.includes("kubernetes")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="56" fill="#326CE5" />
        {/* Outer 7 spokes */}
        <path
          d="M64 26L68 36H60L64 26ZM96 42L89 49L84 43L96 42ZM103 76L93 74L95 68L103 76ZM81 101L75 93L80 89L81 101ZM47 101L48 89L53 93L47 101ZM25 76L33 68L35 74L25 76ZM32 42L44 43L39 49L32 42Z"
          fill="#FFFFFF"
        />
        <circle cx="64" cy="64" r="22" fill="#326CE5" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="64" cy="64" r="8" fill="#FFFFFF" />
      </svg>
    );
  }

  // React Native: Atom with mobile phone frame
  if (n.includes("react native")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="42" y="24" width="44" height="80" rx="8" stroke="#61DAFB" strokeWidth="4" fill="rgba(10, 10, 10, 0.6)" />
        <line x1="58" y1="32" x2="70" y2="32" stroke="#61DAFB" strokeWidth="3" strokeLinecap="round" />
        <circle cx="64" cy="94" r="3" fill="#61DAFB" />
        <g transform="translate(64,64) scale(2.2)">
          <circle cx="0" cy="0" r="1.8" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="0.8" fill="none">
            <ellipse rx="8" ry="3" />
            <ellipse rx="8" ry="3" transform="rotate(60)" />
            <ellipse rx="8" ry="3" transform="rotate(120)" />
          </g>
        </g>
      </svg>
    );
  }

  // Expo: Official triangular chevron logo
  if (n.includes("expo")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="56" fill="#000020" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        <path
          d="M42 88L64 44L86 88H72L64 70L56 88H42Z"
          fill="#FAFAFA"
        />
        <path
          d="M64 44L74 64H54L64 44Z"
          fill="#4630EB"
        />
      </svg>
    );
  }

  // Git & CI/CD: Official orange diamond with branching nodes
  if (n.includes("git")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(45 64 64)">
          <rect x="24" y="24" width="80" height="80" rx="14" fill="#F05032" />
          <line x1="38" y1="44" x2="38" y2="84" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <line x1="38" y1="64" x2="74" y2="64" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="38" cy="44" r="9" fill="#FFFFFF" />
          <circle cx="38" cy="84" r="9" fill="#FFFFFF" />
          <circle cx="74" cy="64" r="9" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // Linux / Bash: Official Tux penguin
  if (n.includes("linux")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="64" cy="74" rx="34" ry="40" fill="#222222" />
        <circle cx="64" cy="38" r="24" fill="#222222" />
        {/* Belly */}
        <ellipse cx="64" cy="78" rx="22" ry="28" fill="#FAFAFA" />
        {/* Eyes */}
        <ellipse cx="56" cy="36" rx="4" ry="6" fill="#FAFAFA" />
        <ellipse cx="72" cy="36" rx="4" ry="6" fill="#FAFAFA" />
        <circle cx="58" cy="37" r="2.5" fill="#000000" />
        <circle cx="70" cy="37" r="2.5" fill="#000000" />
        {/* Beak */}
        <path d="M54 44C54 44 64 53 74 44C70 48 64 52 54 44Z" fill="#FFA000" />
        {/* Feet */}
        <ellipse cx="44" cy="112" rx="14" ry="6" fill="#FFA000" />
        <ellipse cx="84" cy="112" rx="14" ry="6" fill="#FFA000" />
      </svg>
    );
  }

  // Vercel: Official triangle
  if (n.includes("vercel")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="64,22 116,106 12,106" fill="#FAFAFA" />
      </svg>
    );
  }

  // Fallback generic tech icon
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="100" height="100" rx="16" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <circle cx="64" cy="64" r="24" stroke="#c87eff" strokeWidth="4" />
    </svg>
  );
}
