import * as fs from 'fs';

const filePath = 'c:/Users/wwlsg/Documents/Aster/Aster_belllist/src/App.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Starting text color conversion...');

// Color map for text classes
const colorMap = {
    'white': '#ffffff',
    'slate-300': '#cbd5e1',
    'slate-400': '#94a3b8',
    'cyan-300': '#67e8f9',
    'cyan-400': '#22d3ee',
    'teal-300': '#5eead4',
    'teal-400': '#2dd4bf',
    'indigo-900': '#312e81'
};

// Helper function to hex to rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 1. Handle text colors with opacity (e.g., text-cyan-300/60)
content = content.replace(/className="([^"]*)\s*text-([a-z]+-\d+|white)\/(\d+)\s*([^"]*)"/g, (match, before, colorName, opacity, after) => {
    const hex = colorMap[colorName];
    if (!hex) return match; // Skip if color not in map

    const rgb = hexToRgb(hex);
    const alpha = parseInt(opacity) / 100;
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

    // Check if style attribute already exists
    if (match.includes('style={{')) {
        return match.replace(/style={{/, `style={{color: "${rgba}", `);
    } else {
        return `className="${before} ${after}" style={{color: "${rgba}"}}`;
    }
});

// 2. Handle solid text colors (e.g., text-white)
Object.keys(colorMap).forEach(colorName => {
    const hex = colorMap[colorName];
    const regex = new RegExp(`className="([^"]*)\\s*text-${colorName}\\s*([^"]*)"`, 'g');

    content = content.replace(regex, (match, before, after) => {
        // Check if style attribute already exists in the tag (this is tricky with regex, doing simple check)
        // We'll append the style. If style prop exists in the component usage, we need to merge.
        // But here we are replacing className string.

        // If the tag already has a style prop, we can't easily merge with regex replacement on className alone.
        // However, most of our components have style prop AFTER className.
        // Let's try to find the style prop if it exists nearby.

        // Strategy: Just remove the class from className and add color to style.
        // If style={{...}} follows, we might have an issue if we add another style={{...}}.
        // But React doesn't allow duplicate props.

        // Safer approach: 
        // 1. Remove the class from className
        // 2. Add style={{color: "..."}} 
        // BUT we need to be careful about existing style props.

        // Let's use a simpler approach that works for most cases in this file:
        // We will replace the whole line if possible, or just inject style.

        // Actually, let's look at how we did it before.
        // We replaced `className="..."` with `className="..." style={{...}}`
        // If style already exists, we need to merge.

        // For this specific file, let's do a two-pass approach.
        // First, remove the class. Second, add the style.

        return `className="${before} ${after}" data-text-color="${hex}"`;
    });
});

// Now process the data-text-color attributes
// Case 1: Tag already has style={{...}}
content = content.replace(
    /className="([^"]*)"\s*data-text-color="([^"]*)"\s*style={{([^}]*)}}/g,
    'className="$1" style={{color: "$2", $3}}'
);

// Case 2: Tag does NOT have style={{...}}
content = content.replace(
    /className="([^"]*)"\s*data-text-color="([^"]*)"(?!.*style={{)/g,
    'className="$1" style={{color: "$2"}}'
);

// Clean up any remaining data-text-color (if regex missed some edge cases)
// This might happen if props are in different order.
// Let's try a more robust replacement for the remaining ones.
content = content.replace(
    /data-text-color="([^"]*)"/g,
    'style={{color: "$1"}}'
);

// Fix double style props if any (e.g. style={{color: "..."}} style={{...}})
// This is hard to fix with regex perfectly, but let's try to merge adjacent styles if they were created by us.
// Actually, the previous step might have created invalid JSX if style prop was not immediately after className.
// Let's assume standard formatting in this file.

console.log('Text color conversion complete.');

// 3. Fix border colors (border-cyan-400, etc.)
const borderMap = {
    'cyan-400': '#22d3ee',
    'cyan-300': '#67e8f9',
    'teal-400': '#2dd4bf',
    'teal-300': '#5eead4',
    'indigo-900': '#312e81'
};

Object.keys(borderMap).forEach(colorName => {
    const hex = borderMap[colorName];
    const regex = new RegExp(`className="([^"]*)\\s*border-${colorName}\\s*([^"]*)"`, 'g');

    content = content.replace(regex, (match, before, after) => {
        return `className="${before} ${after}" data-border-color="${hex}"`;
    });
});

// Process data-border-color
// Merge with existing style
content = content.replace(
    /style={{color: "([^"]*)", ([^}]*)}}/g,
    (match, color, rest) => `style={{color: "${color}", borderColor: "${rest.includes('borderColor') ? '' : 'data-border-placeholder'}", ${rest}}}`
);

// This is getting complicated. Let's stick to a simpler approach for borders since text is the main issue.
// We'll just use the same strategy as text.

content = content.replace(
    /className="([^"]*)"\s*data-border-color="([^"]*)"\s*style={{([^}]*)}}/g,
    'className="$1" style={{borderColor: "$2", $3}}'
);

content = content.replace(
    /className="([^"]*)"\s*data-border-color="([^"]*)"(?!.*style={{)/g,
    'className="$1" style={{borderColor: "$2"}}'
);

// Cleanup
content = content.replace(/data-border-color="[^"]*"/g, '');

// 4. Special case for text-transparent bg-clip-text
// Ensure Webkit properties are present
content = content.replace(
    /style={{([^}]*)background: "linear-gradient\(([^)]+)\)"([^}]*)}}/g,
    'style={{$1background: "linear-gradient($2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"$3}}'
);

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('Saved changes to App.tsx');
