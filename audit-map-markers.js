// Audit script to check map markers vs resort data completeness
const fs = require('fs');

// Read the data.js file
const dataContent = fs.readFileSync('./data.js', 'utf8');

// Extract the skiEatsData object
let startIdx = dataContent.indexOf('const skiEatsData = {');
if (startIdx === -1) {
    console.error('Could not find skiEatsData in data.js');
    process.exit(1);
}

let braceCount = 0;
let inString = false;
let stringChar = null;
let i = startIdx + 'const skiEatsData = '.length;
let objStart = i;

for (; i < dataContent.length; i++) {
    const char = dataContent[i];
    const prevChar = i > 0 ? dataContent[i - 1] : '';
    
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
let skiEatsData;
try {
    skiEatsData = eval('(' + objStr + ')');
} catch (e) {
    console.error('Error parsing skiEatsData:', e.message);
    process.exit(1);
}

const resorts = skiEatsData.resorts || [];

console.log('='.repeat(70));
console.log('MAP MARKER AUDIT - Resorts with Coordinates but Missing Information');
console.log('='.repeat(70));
console.log(`Total resorts: ${resorts.length}\n`);

// Build mapData structure (same as in index.html)
const mapData = {
    resorts: resorts
        .filter(r => r.coordinates && r.coordinates.lat && r.coordinates.lng)
        .map(resort => ({
            name: resort.name,
            lat: resort.coordinates.lat,
            lng: resort.coordinates.lng,
            location: resort.location,
            type: 'resort',
            id: resort.id
        })),
    restaurants: []
};

console.log(`Resorts with valid coordinates (will appear on map): ${mapData.resorts.length}\n`);

// Check each resort that will appear on map
const mapMarkersWithIssues = [];

mapData.resorts.forEach(mapResort => {
    const fullResortData = resorts.find(r => r.id === mapResort.id || r.name === mapResort.name);
    
    if (!fullResortData) {
        mapMarkersWithIssues.push({
            name: mapResort.name,
            id: mapResort.id,
            location: mapResort.location,
            issues: ['Resort not found in full data'],
            hasCoordinates: true,
            hasDescription: false,
            hasImage: false,
            hasLogo: false
        });
        return;
    }
    
    const issues = [];
    const hasDescription = fullResortData.description && fullResortData.description.trim().length > 50;
    const hasImage = fullResortData.image && fullResortData.image.trim() !== '';
    const hasLogo = fullResortData.logo && fullResortData.logo.trim() !== '';
    const hasTerrain = fullResortData.terrain && Object.keys(fullResortData.terrain).length > 0;
    const hasLifts = fullResortData.lifts && Object.keys(fullResortData.lifts).length > 0;
    const hasSeason = fullResortData.season && Object.keys(fullResortData.season).length > 0;
    const hasTravel = fullResortData.travel && Object.keys(fullResortData.travel).length > 0;
    const hasReviews = fullResortData.platformReviews && Object.keys(fullResortData.platformReviews).length > 0;
    
    if (!hasDescription) issues.push('missing or very short description');
    if (!hasImage) issues.push('missing image');
    if (!hasLogo) issues.push('missing logo');
    if (!hasTerrain) issues.push('missing terrain data');
    if (!hasLifts) issues.push('missing lifts data');
    if (!hasSeason) issues.push('missing season data');
    if (!hasTravel) issues.push('missing travel data');
    if (!hasReviews) issues.push('missing platform reviews');
    
    if (issues.length > 0) {
        mapMarkersWithIssues.push({
            name: fullResortData.name,
            id: fullResortData.id,
            location: fullResortData.location,
            issues,
            hasCoordinates: true,
            hasDescription,
            hasImage,
            hasLogo,
            hasTerrain,
            hasLifts,
            hasSeason,
            hasTravel,
            hasReviews
        });
    }
});

console.log(`Map markers with missing information: ${mapMarkersWithIssues.length} out of ${mapData.resorts.length}\n`);

if (mapMarkersWithIssues.length > 0) {
    console.log('DETAILED MAP MARKER ISSUES:');
    console.log('-'.repeat(70));
    
    mapMarkersWithIssues.forEach((resort, idx) => {
        console.log(`\n${idx + 1}. ${resort.name} (ID: ${resort.id})`);
        console.log(`   Location: ${resort.location}`);
        console.log(`   Issues:`);
        resort.issues.forEach(issue => console.log(`      ❌ ${issue}`));
        
        // Show what data IS available
        const available = [];
        if (resort.hasDescription) available.push('description');
        if (resort.hasImage) available.push('image');
        if (resort.hasLogo) available.push('logo');
        if (resort.hasTerrain) available.push('terrain');
        if (resort.hasLifts) available.push('lifts');
        if (resort.hasSeason) available.push('season');
        if (resort.hasTravel) available.push('travel');
        if (resort.hasReviews) available.push('reviews');
        
        if (available.length > 0) {
            console.log(`   Available: ${available.join(', ')}`);
        }
    });
}

// Summary by issue type
console.log('\n' + '='.repeat(70));
console.log('SUMMARY BY ISSUE TYPE:');
console.log('='.repeat(70));

const issueCounts = {};
mapMarkersWithIssues.forEach(resort => {
    resort.issues.forEach(issue => {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });
});

Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([issue, count]) => {
        console.log(`  ${issue}: ${count} resorts`);
    });

// Critical issues: markers on map with no description
const criticalIssues = mapMarkersWithIssues.filter(r => !r.hasDescription);
console.log('\n' + '='.repeat(70));
console.log('CRITICAL: Map markers WITHOUT descriptions:');
console.log('='.repeat(70));
console.log(`Count: ${criticalIssues.length}`);
if (criticalIssues.length > 0) {
    criticalIssues.forEach(r => {
        console.log(`  • ${r.name} (${r.location})`);
    });
}



