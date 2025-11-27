import * as fs from 'fs';

// Read the file
const filePath = 'c:/Users/wwlsg/Documents/Aster/Aster_belllist/src/App.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Remove alpha from Tailwind classes but keep track for inline conversion
content = content.replace(/bg-([a-z]+-\d+)\/(\d+)/g, (match, color, alpha) => {
    return `bg-${color} data-alpha="${alpha}"`;
});
content = content.replace(/border-([a-z]+-\d+)\/\d+/g, 'border-$1');
content = content.replace(/text-([a-z]+-\d+)\/\d+/g, 'text-$1');
content = content.replace(/shadow-([a-z]+-\d+)\/\d+/g, 'shadow-$1');
content = content.replace(/hover:bg-([a-z]+-\d+)\/\d+/g, 'hover:bg-$1');
content = content.replace(/hover:shadow-([a-z]+-\d+)\/\d+/g, 'hover:shadow-$1');
content = content.replace(/from-([a-z]+-\d+)\/\d+/g, 'from-$1');
content = content.replace(/to-([a-z]+-\d+)\/\d+/g, 'to-$1');
content = content.replace(/via-([a-z]+-\d+)\/\d+/g, 'via-$1');

// Remove backdrop-blur
content = content.replace(/\s+backdrop-blur-sm/g, '');

// Replace gradients with inline style gradients (keeping the gradient effect!)
content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-br\s+from-slate-800\s+to-blue-900\s*([^"]*)"/g,
    'className="$1$2" style={{background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))"}}'
);

content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-400\s+to-teal-500\s*([^"]*)"/g,
    'className="$1$2" style={{background: "linear-gradient(to right, #22d3ee, #14b8a6)"}}'
);

content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-400\s+to-teal-300\s*([^"]*)"/g,
    'className="$1$2" style={{background: "linear-gradient(to right, #22d3ee, #5eead4)"}}'
);

content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-r\s+from-teal-400\s+to-cyan-300\s*([^"]*)"/g,
    'className="$1$2" style={{background: "linear-gradient(to right, #2dd4bf, #67e8f9)"}}'
);

content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-r\s+from-cyan-300\s+to-teal-400\s*([^"]*)"/g,
    'className="$1$2" style={{background: "linear-gradient(to right, #67e8f9, #2dd4bf)"}}'
);

content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-r\s+from-indigo-800\s+to-blue-700\s*([^"]*)"/g,
    'className="$1$2" style={{background: "linear-gradient(to right, #3730a3, #1d4ed8)"}}'
);

// Handle any remaining gradients - convert to "to" color with rgba
content = content.replace(
    /className="([^"]*)\s*bg-gradient-to-r\s+from-([a-z]+-\d+)\s+to-([a-z]+-\d+)\s*([^"]*)"/g,
    'className="$1$4" style={{background: "linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))"}}'
);

// Replace Tailwind background classes with inline styles using rgba for transparency
const colorMapWithAlpha = {
    'blue-500': { hex: '#3b82f6', rgba: 'rgba(59, 130, 246, 0.3)' },
    'teal-500': { hex: '#14b8a6', rgba: 'rgba(20, 184, 166, 0.3)' },
    'emerald-500': { hex: '#10b981', rgba: 'rgba(16, 185, 129, 0.3)' },
    'slate-700': { hex: '#334155', rgba: 'rgba(51, 65, 85, 0.5)' },
    'slate-800': { hex: '#1e293b', rgba: 'rgba(30, 41, 59, 0.8)' },
    'blue-900': { hex: '#1e3a8a', rgba: 'rgba(30, 58, 138, 0.6)' },
    'blue-800': { hex: '#1e40af', rgba: 'rgba(30, 64, 175, 0.6)' },
    'indigo-800': { hex: '#3730a3', rgba: 'rgba(55, 48, 163, 1)' }
};

Object.keys(colorMapWithAlpha).forEach(color => {
    const colors = colorMapWithAlpha[color];
    // Use rgba for elements that originally had transparency
    content = content.replace(
        new RegExp(`className="([^"]*)\\s*bg-${color}\\s+data-alpha="30"\\s*([^"]*)"`, 'g'),
        `className="$1$2" style={{backgroundColor: "${colors.rgba.replace('0.3', '0.3')}"}}`
    );
    content = content.replace(
        new RegExp(`className="([^"]*)\\s*bg-${color}\\s+data-alpha="50"\\s*([^"]*)"`, 'g'),
        `className="$1$2" style={{backgroundColor: "${colors.rgba.replace('0.3', '0.5')}"}}`
    );
    content = content.replace(
        new RegExp(`className="([^"]*)\\s*bg-${color}\\s+data-alpha="60"\\s*([^"]*)"`, 'g'),
        `className="$1$2" style={{backgroundColor: "${colors.rgba.replace('0.3', '0.6')}"}}`
    );
    content = content.replace(
        new RegExp(`className="([^"]*)\\s*bg-${color}\\s+data-alpha="80"\\s*([^"]*)"`, 'g'),
        `className="$1$2" style={{backgroundColor: "${colors.rgba.replace('0.3', '0.8')}"}}`
    );
    // Use solid hex for elements without transparency
    content = content.replace(
        new RegExp(`className="([^"]*)\\s*bg-${color}\\s*([^"]*)"`, 'g'),
        `className="$1$2" style={{backgroundColor: "${colors.hex}"}}`
    );
});

// Clean up any remaining data-alpha attributes
content = content.replace(/\s+data-alpha="\d+"/g, '');

// Write back
fs.writeFileSync(filePath, content, 'utf-8');

console.log('Applied original gradient colors with inline styles for older devices');
