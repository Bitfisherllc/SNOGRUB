// Audit script to check for missing resort information
const fs = require('fs');

// Read the data.js file
const dataContent = fs.readFileSync('./data.js', 'utf8');

// Extract the skiEatsData object using a more robust approach
// Find where const skiEatsData starts and extract until the closing brace
let startIdx = dataContent.indexOf('const skiEatsData = {');
if (startIdx === -1) {
    console.error('Could not find skiEatsData in data.js');
    process.exit(1);
}

// Find the matching closing brace
let braceCount = 0;
let inString = false;
let stringChar = null;
let i = startIdx + 'const skiEatsData = '.length;
let objStart = i;

for (; i < dataContent.length; i++) {
    const char = dataContent[i];
    const prevChar = i > 0 ? dataContent[i - 1] : '';
    
    // Handle string literals
    if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
    } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = null;
    }
    
    if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
                break;
            }
        }
    }
}

const objStr = dataContent.substring(objStart, i + 1);

// Evaluate the object (in a safe way)
let skiEatsData;
try {
    skiEatsData = eval('(' + objStr + ')');
} catch (e) {
    console.error('Error parsing skiEatsData:', e.message);
    process.exit(1);
}

const resorts = skiEatsData.resorts || [];
console.log('='.repeat(60));
console.log('RESORT DATA AUDIT');
console.log('='.repeat(60));
console.log(`Total resorts: ${resorts.length}\n`);

const issues = [];
resorts.forEach((r, i) => {
    const problems = [];
    
    if (!r.name || r.name.trim() === '') problems.push('missing name');
    if (!r.location || r.location.trim() === '') problems.push('missing location');
    if (!r.description || r.description.trim() === '') problems.push('missing description');
    if (!r.coordinates || !r.coordinates.lat || !r.coordinates.lng) {
        problems.push('missing coordinates');
    }
    if (!r.image || r.image.trim() === '') problems.push('missing image');
    if (!r.logo || r.logo.trim() === '') problems.push('missing logo');
    if (!r.id || r.id.trim() === '') problems.push('missing id');
    
    if (problems.length > 0) {
        issues.push({ 
            index: i, 
            id: r.id || 'NO_ID',
            name: r.name || 'NO_NAME', 
            problems 
        });
    }
});

console.log(`Resorts with missing information: ${issues.length} out of ${resorts.length}\n`);

if (issues.length > 0) {
    console.log('DETAILED ISSUES:');
    console.log('-'.repeat(60));
    issues.forEach(issue => {
        console.log(`\n${issue.index + 1}. ${issue.name} (ID: ${issue.id})`);
        issue.problems.forEach(p => console.log(`   ❌ ${p}`));
    });
}

// Check for resorts that appear on map but have no description
console.log('\n' + '='.repeat(60));
console.log('MAP MARKERS WITHOUT DESCRIPTIONS:');
console.log('='.repeat(60));
const coordsButNoDesc = resorts.filter(r => 
    r.coordinates && r.coordinates.lat && r.coordinates.lng && 
    (!r.description || r.description.trim() === '')
);

console.log(`Resorts with coordinates but no description: ${coordsButNoDesc.length}`);
if (coordsButNoDesc.length > 0) {
    coordsButNoDesc.forEach(r => {
        console.log(`  • ${r.name || r.id} (${r.coordinates.lat}, ${r.coordinates.lng})`);
    });
}

// Summary statistics
console.log('\n' + '='.repeat(60));
console.log('SUMMARY STATISTICS:');
console.log('='.repeat(60));
console.log(`Total resorts: ${resorts.length}`);
console.log(`Resorts with complete data: ${resorts.length - issues.length}`);
console.log(`Resorts missing data: ${issues.length}`);
console.log(`Resorts on map without descriptions: ${coordsButNoDesc.length}`);

// Check which fields are most commonly missing
const fieldCounts = {
    'name': 0,
    'location': 0,
    'description': 0,
    'coordinates': 0,
    'image': 0,
    'logo': 0,
    'id': 0
};

issues.forEach(issue => {
    issue.problems.forEach(problem => {
        const field = problem.replace('missing ', '').trim();
        if (fieldCounts.hasOwnProperty(field)) {
            fieldCounts[field]++;
        }
    });
});

console.log('\nMost commonly missing fields:');
Object.entries(fieldCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0)
    .forEach(([field, count]) => {
        console.log(`  • ${field}: ${count} resorts`);
    });



