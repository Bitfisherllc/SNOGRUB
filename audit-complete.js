// Complete audit script - checks all aspects of resort data
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

console.log('='.repeat(80));
console.log('COMPREHENSIVE RESORT DATA AUDIT');
console.log('='.repeat(80));
console.log(`Total resorts in database: ${resorts.length}\n`);

// Categorize resorts
const categories = {
    complete: [],
    missingLogo: [],
    missingDescription: [],
    missingCoordinates: [],
    missingImage: [],
    missingTerrain: [],
    missingLifts: [],
    missingSeason: [],
    missingTravel: [],
    missingReviews: [],
    minimal: [] // Has coordinates but very little other data
};

resorts.forEach(resort => {
    const hasDescription = resort.description && resort.description.trim().length > 100;
    const hasCoordinates = resort.coordinates && resort.coordinates.lat && resort.coordinates.lng;
    const hasImage = resort.image && resort.image.trim() !== '';
    const hasLogo = resort.logo && resort.logo.trim() !== '';
    const hasTerrain = resort.terrain && Object.keys(resort.terrain).length > 0;
    const hasLifts = resort.lifts && Object.keys(resort.lifts).length > 0;
    const hasSeason = resort.season && Object.keys(resort.season).length > 0;
    const hasTravel = resort.travel && Object.keys(resort.travel).length > 0;
    const hasReviews = resort.platformReviews && Object.keys(resort.platformReviews).length > 0;
    
    // Count data completeness
    const dataPoints = [
        hasDescription, hasCoordinates, hasImage, hasLogo,
        hasTerrain, hasLifts, hasSeason, hasTravel, hasReviews
    ].filter(Boolean).length;
    
    if (!hasCoordinates) categories.missingCoordinates.push(resort);
    if (!hasDescription) categories.missingDescription.push(resort);
    if (!hasLogo) categories.missingLogo.push(resort);
    if (!hasImage) categories.missingImage.push(resort);
    if (!hasTerrain) categories.missingTerrain.push(resort);
    if (!hasLifts) categories.missingLifts.push(resort);
    if (!hasSeason) categories.missingSeason.push(resort);
    if (!hasTravel) categories.missingTravel.push(resort);
    if (!hasReviews) categories.missingReviews.push(resort);
    
    if (hasCoordinates && dataPoints < 5) {
        categories.minimal.push(resort);
    }
    
    if (hasCoordinates && hasDescription && hasImage && hasLogo && 
        hasTerrain && hasLifts && hasSeason && hasTravel && hasReviews) {
        categories.complete.push(resort);
    }
});

// Print summary
console.log('DATA COMPLETENESS SUMMARY:');
console.log('-'.repeat(80));
console.log(`✅ Complete resorts (all data): ${categories.complete.length}`);
console.log(`❌ Missing coordinates (won't appear on map): ${categories.missingCoordinates.length}`);
console.log(`❌ Missing description: ${categories.missingDescription.length}`);
console.log(`❌ Missing logo: ${categories.missingLogo.length}`);
console.log(`❌ Missing image: ${categories.missingImage.length}`);
console.log(`❌ Missing terrain data: ${categories.missingTerrain.length}`);
console.log(`❌ Missing lifts data: ${categories.missingLifts.length}`);
console.log(`❌ Missing season data: ${categories.missingSeason.length}`);
console.log(`❌ Missing travel data: ${categories.missingTravel.length}`);
console.log(`❌ Missing platform reviews: ${categories.missingReviews.length}`);
console.log(`⚠️  Minimal data (on map but very little info): ${categories.minimal.length}`);

// Critical: Resorts on map without descriptions
console.log('\n' + '='.repeat(80));
console.log('🚨 CRITICAL ISSUE: Resorts on Map WITHOUT Descriptions');
console.log('='.repeat(80));
const onMapNoDesc = categories.missingDescription.filter(r => 
    r.coordinates && r.coordinates.lat && r.coordinates.lng
);
console.log(`Count: ${onMapNoDesc.length}`);
if (onMapNoDesc.length > 0) {
    onMapNoDesc.forEach(r => {
        console.log(`  • ${r.name} (${r.location || 'No location'}) - ID: ${r.id}`);
    });
} else {
    console.log('✅ All resorts on map have descriptions!');
}

// Resorts with minimal data
if (categories.minimal.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('⚠️  Resorts on Map with MINIMAL Data (may appear incomplete)');
    console.log('='.repeat(80));
    categories.minimal.forEach(r => {
        const hasDesc = r.description && r.description.trim().length > 100;
        const hasImg = r.image && r.image.trim() !== '';
        const hasLogo = r.logo && r.logo.trim() !== '';
        const hasTerrain = r.terrain && Object.keys(r.terrain).length > 0;
        const hasLifts = r.lifts && Object.keys(r.lifts).length > 0;
        
        console.log(`\n${r.name} (${r.location || 'No location'})`);
        console.log(`  Has: ${[
            hasDesc && 'description',
            hasImg && 'image',
            hasLogo && 'logo',
            hasTerrain && 'terrain',
            hasLifts && 'lifts'
        ].filter(Boolean).join(', ') || 'only coordinates'}`);
    });
}

// Detailed breakdown
console.log('\n' + '='.repeat(80));
console.log('DETAILED BREAKDOWN BY ISSUE');
console.log('='.repeat(80));

if (categories.missingLogo.length > 0) {
    console.log(`\nMissing Logo (${categories.missingLogo.length}):`);
    categories.missingLogo.forEach(r => console.log(`  • ${r.name}`));
}

if (categories.missingImage.length > 0) {
    console.log(`\nMissing Image (${categories.missingImage.length}):`);
    categories.missingImage.forEach(r => console.log(`  • ${r.name}`));
}

if (categories.missingTerrain.length > 0) {
    console.log(`\nMissing Terrain Data (${categories.missingTerrain.length}):`);
    categories.missingTerrain.forEach(r => console.log(`  • ${r.name}`));
}

if (categories.missingLifts.length > 0) {
    console.log(`\nMissing Lifts Data (${categories.missingLifts.length}):`);
    categories.missingLifts.forEach(r => console.log(`  • ${r.name}`));
}

if (categories.missingSeason.length > 0) {
    console.log(`\nMissing Season Data (${categories.missingSeason.length}):`);
    categories.missingSeason.forEach(r => console.log(`  • ${r.name}`));
}

if (categories.missingTravel.length > 0) {
    console.log(`\nMissing Travel Data (${categories.missingTravel.length}):`);
    categories.missingTravel.forEach(r => console.log(`  • ${r.name}`));
}

if (categories.missingReviews.length > 0) {
    console.log(`\nMissing Platform Reviews (${categories.missingReviews.length}):`);
    categories.missingReviews.forEach(r => console.log(`  • ${r.name}`));
}

// Final recommendations
console.log('\n' + '='.repeat(80));
console.log('RECOMMENDATIONS');
console.log('='.repeat(80));

if (onMapNoDesc.length > 0) {
    console.log(`\n🚨 PRIORITY: Add descriptions to ${onMapNoDesc.length} resorts that appear on map`);
}

if (categories.missingLogo.length > 0) {
    console.log(`\n📝 Add logos for ${categories.missingLogo.length} resorts`);
}

if (categories.minimal.length > 0) {
    console.log(`\n⚠️  Consider enriching data for ${categories.minimal.length} resorts with minimal information`);
}

console.log('\n✅ Audit complete!');






