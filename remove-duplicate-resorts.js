#!/usr/bin/env node

/**
 * Remove duplicate resorts from data.js
 * 
 * This script removes the older versions of duplicate resorts,
 * keeping only the newest version (last occurrence) of each duplicate ID.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.js');

// IDs of resorts to remove (older versions)
const IDs_TO_REMOVE = [
    'aspen-snowmass',      // Remove index 4, keep 172
    'copper-mountain',     // Remove index 10, keep 174
    'arapahoe-basin',      // Remove index 12, keep 179
    'jackson-hole',        // Remove index 13, keep 159
    'mammoth-mountain',    // Remove index 16, keep 166
    'snowbird',            // Remove index 19, keep 161
    'palisades-tahoe',     // Remove index 23, keep 167
    'mount-snow',          // Remove index 30, keep 157
    'sun-valley',          // Remove index 31, keep 181
    'crested-butte',       // Remove index 32, keep 178
    'jay-peak',            // Remove index 33, keep 154
    'smugglers-notch',     // Remove index 36, keep 156
    'loon-mountain',       // Remove index 40, keep 148
    'whiteface-mountain',  // Remove index 41, keep 149
    'stratton-mountain',   // Remove index 42, keep 150
    'powder-mountain',     // Remove index 43, keep 138
    'mt-bachelor',         // Remove index 47, keep 143
    'stevens-pass',        // Remove index 49, keep 145
    'mt-hood-meadows',     // Remove index 50, keep 146
    'timberline-lodge',    // Remove index 51, keep 147
    'sierra-at-tahoe',     // Remove index 64, keep 186
    'june-mountain',       // Remove index 67, keep 189
    'dodge-ridge',         // Remove index 68, keep 190
    'ober-gatlinburg',     // Remove index 197, keep 289
    'ski-butternut'        // Remove index 200, keep 309
];

function removeDuplicates() {
    try {
        console.log('Loading data.js...');
        
        // Read and evaluate the data file
        const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
        
        // Wrap in a function to capture skiEatsData
        const wrappedCode = `
            ${dataContent}
            return skiEatsData;
        `;
        
        const getData = new Function(wrappedCode);
        const skiEatsData = getData();
        
        if (!skiEatsData || !skiEatsData.resorts || !Array.isArray(skiEatsData.resorts)) {
            console.error('Could not find resorts array in data.js');
            process.exit(1);
        }
        
        const originalCount = skiEatsData.resorts.length;
        console.log(`Found ${originalCount} resorts`);
        
        // Track which IDs we've seen - keep only the LAST occurrence of each ID
        const idLastSeen = new Map();
        const resortsToKeep = [];
        const removedResorts = [];
        
        // First pass: find the last occurrence of each ID in IDs_TO_REMOVE
        skiEatsData.resorts.forEach((resort, index) => {
            if (IDs_TO_REMOVE.includes(resort.id)) {
                idLastSeen.set(resort.id, index);
            }
        });
        
        // Second pass: filter resorts
        skiEatsData.resorts.forEach((resort, index) => {
            if (IDs_TO_REMOVE.includes(resort.id)) {
                // This is a duplicate ID
                const lastIndex = idLastSeen.get(resort.id);
                if (index === lastIndex) {
                    // This is the last occurrence - keep it
                    resortsToKeep.push(resort);
                    console.log(`✓ Keeping "${resort.name}" (ID: ${resort.id}) at index ${index}`);
                } else {
                    // This is an earlier occurrence - remove it
                    removedResorts.push({ index, resort });
                    console.log(`✗ Removing "${resort.name}" (ID: ${resort.id}) at index ${index}`);
                }
            } else {
                // Not a duplicate - keep it
                resortsToKeep.push(resort);
            }
        });
        
        console.log(`\nRemoved ${removedResorts.length} duplicate resorts`);
        console.log(`Kept ${resortsToKeep.length} resorts (down from ${originalCount})`);
        
        // Update the data
        skiEatsData.resorts = resortsToKeep;
        
        // Now we need to rewrite the file
        console.log('\nRewriting data.js...');
        
        // Read the original file to get the structure
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        
        // Find where resorts array starts and ends
        const resortsStartMatch = fileContent.match(/(\s*resorts:\s*\[)/);
        const restaurantsStartMatch = fileContent.match(/(\s*restaurants:\s*\[)/);
        
        if (!resortsStartMatch || !restaurantsStartMatch) {
            throw new Error('Could not find resorts or restaurants array boundaries');
        }
        
        const resortsStartPos = resortsStartMatch.index + resortsStartMatch[0].length;
        const restaurantsStartPos = restaurantsStartMatch.index;
        
        // Get the prefix (before resorts array)
        const prefix = fileContent.substring(0, resortsStartMatch.index) + resortsStartMatch[0];
        
        // Get the suffix (after resorts array, starting with restaurants)
        const suffix = fileContent.substring(restaurantsStartPos);
        
        // Format resorts array
        const indent = '        ';
        const resortStrings = resortsToKeep.map((resort, idx) => {
            return formatResort(resort, indent, idx === resortsToKeep.length - 1);
        });
        
        const resortsArrayContent = resortStrings.join(',\n');
        
        // Combine everything
        const newContent = prefix + '\n' + resortsArrayContent + '\n    ],' + suffix;
        
        // Create backup
        const backupFile = DATA_FILE + '.backup.' + Date.now();
        fs.writeFileSync(backupFile, fileContent, 'utf8');
        console.log(`Created backup: ${backupFile}`);
        
        // Write new content
        fs.writeFileSync(DATA_FILE, newContent, 'utf8');
        
        console.log('\n✅ Successfully removed duplicate resorts!');
        console.log(`   Removed: ${removedResorts.length} resorts`);
        console.log(`   Remaining: ${resortsToKeep.length} resorts`);
        
    } catch (error) {
        console.error('Error removing duplicates:', error);
        process.exit(1);
    }
}

function formatResort(resort, indent, isLast) {
    // Use JSON.stringify and convert to JS format for complex objects
    // This preserves the exact structure
    const indent1 = indent; // 12 spaces
    const indent2 = indent + '    '; // 16 spaces
    const indent3 = indent + '        '; // 20 spaces
    
    let output = `${indent1}{\n`;
    output += `${indent2}id: '${resort.id}',\n`;
    output += `${indent2}name: '${escapeString(resort.name)}',\n`;
    output += `${indent2}location: '${escapeString(resort.location)}',\n`;
    output += `${indent2}coordinates: { lat: ${resort.coordinates.lat}, lng: ${resort.coordinates.lng} },\n`;
    output += `${indent2}description: '${escapeString(resort.description)}',\n`;
    output += `${indent2}image: '${resort.image}',\n`;
    output += `${indent2}logo: '${resort.logo}',\n`;
    output += `${indent2}restaurantCount: ${resort.restaurantCount},\n`;
    output += `${indent2}featured: ${resort.featured},\n`;
    
    // Terrain
    output += `${indent2}terrain: {\n`;
    output += `${indent3}skiableAcres: ${resort.terrain.skiableAcres},\n`;
    output += `${indent3}verticalDrop: ${resort.terrain.verticalDrop},\n`;
    output += `${indent3}baseElevation: ${resort.terrain.baseElevation},\n`;
    output += `${indent3}summitElevation: ${resort.terrain.summitElevation},\n`;
    output += `${indent3}snowmakingCoverage: '${escapeString(resort.terrain.snowmakingCoverage || '')}'\n`;
    output += `${indent2}},\n`;
    
    // Lifts
    output += `${indent2}lifts: {\n`;
    output += `${indent3}total: ${resort.lifts.total},\n`;
    output += `${indent3}types: {\n`;
    const types = resort.lifts.types || {};
    output += `${indent3}    gondolas: ${types.gondolas || 0},\n`;
    output += `${indent3}    highSpeedSixPack: ${types.highSpeedSixPack || 0},\n`;
    output += `${indent3}    highSpeedQuads: ${types.highSpeedQuads || 0},\n`;
    output += `${indent3}    quadChairs: ${types.quadChairs || 0},\n`;
    output += `${indent3}    tripleChairs: ${types.tripleChairs || 0},\n`;
    output += `${indent3}    doubleChairs: ${types.doubleChairs || 0},\n`;
    output += `${indent3}    surfaceLifts: ${types.surfaceLifts || 0}\n`;
    output += `${indent3}},\n`;
    output += `${indent3}notable: '${escapeString(resort.lifts.notable || '')}',\n`;
    output += `${indent3}hourlyCapacity: ${resort.lifts.hourlyCapacity || 0}\n`;
    output += `${indent2}},\n`;
    
    // Trails
    output += `${indent2}trails: {\n`;
    output += `${indent3}total: ${resort.trails.total},\n`;
    output += `${indent3}beginner: ${resort.trails.beginner},\n`;
    output += `${indent3}intermediate: ${resort.trails.intermediate},\n`;
    output += `${indent3}advanced: ${resort.trails.advanced},\n`;
    output += `${indent3}expert: ${resort.trails.expert},\n`;
    output += `${indent3}longestRun: '${escapeString(resort.trails.longestRun || '')}',\n`;
    output += `${indent3}terrainParks: ${resort.trails.terrainParks || 0},\n`;
    output += `${indent3}superpipe: ${resort.trails.superpipe || false},\n`;
    output += `${indent3}halfpipes: ${resort.trails.halfpipes || false},\n`;
    output += `${indent3}bowls: ${resort.trails.bowls || false},\n`;
    output += `${indent3}woodedAreas: ${resort.trails.woodedAreas || false},\n`;
    output += `${indent3}nightSkiing: ${resort.trails.nightSkiing || false}\n`;
    output += `${indent2}},\n`;
    
    // Season
    output += `${indent2}season: {\n`;
    output += `${indent3}start: '${escapeString(resort.season.start || '')}',\n`;
    output += `${indent3}end: '${escapeString(resort.season.end || '')}',\n`;
    output += `${indent3}averageSnowfall: ${resort.season.averageSnowfall || 0}\n`;
    output += `${indent2}},\n`;
    
    // Travel
    output += `${indent2}travel: {\n`;
    output += `${indent3}nearestAirport: '${escapeString(resort.travel.nearestAirport || '')}',\n`;
    output += `${indent3}airportDistance: '${escapeString(resort.travel.airportDistance || '')}',\n`;
    output += `${indent3}drivingDirections: '${escapeString(resort.travel.drivingDirections || '')}',\n`;
    output += `${indent3}shuttleService: '${escapeString(resort.travel.shuttleService || '')}'\n`;
    output += `${indent2}},\n`;
    
    // Platform Reviews - format as JS object
    output += `${indent2}platformReviews: ${formatPlatformReviews(resort.platformReviews || {}, indent2)}\n`;
    
    output += `${indent1}}`;
    
    return output;
}

function formatPlatformReviews(reviews, baseIndent) {
    if (!reviews || Object.keys(reviews).length === 0) {
        return '{}';
    }
    
    const indent1 = baseIndent; // 12 spaces
    const indent2 = baseIndent + '    '; // 16 spaces
    const indent3 = baseIndent + '        '; // 20 spaces
    
    let output = '{\n';
    const keys = Object.keys(reviews);
    keys.forEach((key, idx) => {
        const review = reviews[key];
        const isLast = idx === keys.length - 1;
        output += `${indent2}'${key}': {\n`;
        output += `${indent3}rating: ${review.rating},\n`;
        output += `${indent3}reviewCount: ${review.reviewCount},\n`;
        output += `${indent3}url: '${review.url}',\n`;
        if (review.positive) {
            output += `${indent3}positive: '${escapeString(review.positive)}',\n`;
        }
        if (review.negative) {
            output += `${indent3}negative: '${escapeString(review.negative)}'${isLast ? '' : ','}\n`;
        } else {
            // Remove trailing comma if no negative
            output = output.replace(/,\n$/, '\n');
        }
        output += `${indent2}}${isLast ? '' : ','}\n`;
    });
    output += `${indent1}}`;
    
    return output;
}

function escapeString(str) {
    if (str === null || str === undefined) return '';
    str = String(str);
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

removeDuplicates();





