import * as fs from 'fs';

// Read the original file
const filePath = 'c:/Users/wwlsg/Documents/Aster/Aster_belllist/temp_original.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Step 1: Removing ConstellationLines component...');
// Remove the ConstellationLines component definition (lines 13-76)
content = content.replace(
    /\/\/ 별자리 연결선 SVG 컴포넌트[\s\S]*?<\/svg>\s*\);/,
    ''
);

console.log('Step 2: Removing ConstellationLines usage...');
// Remove ConstellationLines usage in JSX
content = content.replace(
    /\{\/\* 배경 별자리 \*\/\}\s*<ConstellationLines \/>/,
    ''
);

console.log('Step 3: Removing animated background stars...');
// Remove animated background stars
content = content.replace(
    /\{\/\* 배경 별들 \*\/\}[\s\S]*?<\/div>\s*\{\/\* Screen Content/,
    '{/* Screen Content'
);

console.log('Step 4: Converting main background to inline gradient...');
// Fix main background - add inline style
content = content.replace(
    /className="w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative"/,
    `className="w-full h-screen overflow-hidden relative"\n      style={{\n        background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #312e81)'\n      }}`
);

console.log('Step 5: Converting Tailwind gradients to inline styles...');

// Convert specific gradient patterns to inline styles
const gradientReplacements = [
    {
        // from-slate-800/60 to-blue-900/60
        pattern: /className="([^"]*)\s*bg-gradient-to-br\s+from-slate-800\/60\s+to-blue-900\/60\s+backdrop-blur-sm\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))"}}'
    },
    {
        // from-indigo-800 to-blue-700
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-indigo-800\s+to-blue-700\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to right, #3730a3, #1d4ed8)"}}'
    },
    {
        // from-cyan-400 to-teal-500
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-400\s+to-teal-500\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to right, #22d3ee, #14b8a6)"}}'
    },
    {
        // from-cyan-400 to-teal-300
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-400\s+to-teal-300\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to right, #22d3ee, #5eead4)"}}'
    },
    {
        // from-teal-400 to-cyan-300
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-teal-400\s+to-cyan-300\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to right, #2dd4bf, #67e8f9)"}}'
    },
    {
        // from-cyan-300 to-teal-400
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-300\s+to-teal-400\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to right, #67e8f9, #2dd4bf)"}}'
    },
    {
        // from-teal-500/30 to-cyan-400/30
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-teal-500\/30\s+to-cyan-400\/30\s*([^"]*)"/g,
        replacement: 'className="$1$2" style={{background: "linear-gradient(to right, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.3))"}}'
    },
    {
        // Text gradients - from-cyan-300 via-teal-200 to-cyan-400
        pattern: /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-300\s+via-teal-200\s+to-cyan-400\s+bg-clip-text\s+text-transparent\s*([^"]*)"/g,
        replacement: 'className="$1$2 bg-clip-text text-transparent" style={{background: "linear-gradient(to right, #67e8f9, #99f6e4, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}'
    }
];

gradientReplacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
});

console.log('Step 6: Removing backdrop-blur...');
// Remove all backdrop-blur instances
content = content.replace(/\s*backdrop-blur-sm/g, '');

console.log('Step 7: Converting alpha transparency to rgba...');
// Convert specific transparency patterns
const alphaReplacements = [
    { pattern: /border-cyan-400\/30/g, replacement: 'border-cyan-400' },
    { pattern: /border-cyan-400\/50/g, replacement: 'border-cyan-400' },
    { pattern: /border-cyan-300\/50/g, replacement: 'border-cyan-300' },
    { pattern: /shadow-cyan-400\/10/g, replacement: 'shadow-cyan-400' },
    { pattern: /shadow-cyan-400\/50/g, replacement: 'shadow-cyan-400' }
];

alphaReplacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
});

console.log('Step 8: Converting bg-blue-900/40 to inline style...');
// Navigation buttons bg-blue-900/40
content = content.replace(
    /className="([^"]*)\s*bg-blue-900\/40\s+backdrop-blur-sm\s*([^"]*)"/g,
    'className="$1$2" style={{background: "rgba(30, 58, 138, 0.4)"}}'
);

// Button hover states
content = content.replace(/hover:bg-blue-800\/60/g, 'hover:bg-blue-800');

console.log('Step 9: Converting progress bar background...');
content = content.replace(
    /className="absolute top-0 left-0 right-0 h-1 bg-slate-800\/50 z-20"/,
    'className="absolute top-0 left-0 right-0 h-1 z-20" style={{background: "rgba(30, 41, 59, 0.5)"}}'
);

console.log('Step 10: Converting progress fill gradient...');
content = content.replace(
    /className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 relative"/,
    'className="h-full relative" style={{background: "linear-gradient(to right, #22d3ee, #5eead4, #06b6d4)"}}'
);

// Write to src/App.tsx
const outputPath = 'c:/Users/wwlsg/Documents/Aster/Aster_belllist/src/App.tsx';
fs.writeFileSync(outputPath, content, 'utf-8');

console.log('\n✅ Conversion complete! Saved to src/App.tsx');
console.log('- Removed ConstellationLines SVG animation');
console.log('- Removed animated background stars');
console.log('- Converted all gradients to inline styles');
console.log('- Removed backdrop-blur effects');
console.log('- Converted transparency to rgba()');
