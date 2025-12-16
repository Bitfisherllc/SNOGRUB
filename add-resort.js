#!/usr/bin/env node

/**
 * Add a new ski resort to data.js
 * 
 * Usage: node add-resort.js
 * 
 * This script will prompt you for resort information and add it to data.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATA_FILE = path.join(__dirname, 'data.js');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function generateId(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function getResortData() {
    console.log('\n=== Add New Ski Resort ===\n');
    
    const name = await question('Resort Name: ');
    if (!name) {
        console.log('Resort name is required. Exiting.');
        process.exit(1);
    }
    
    const location = await question('Location (City, State, USA): ');
    const lat = await question('Latitude: ');
    const lng = await question('Longitude: ');
    
    // Basic info
    const description = await question('Description (press Enter twice when done, or leave blank for now):\n');
    const skiableAcres = await question('Skiable Acres (number): ');
    const verticalDrop = await question('Vertical Drop (feet): ');
    const baseElevation = await question('Base Elevation (feet): ');
    const summitElevation = await question('Summit Elevation (feet): ');
    
    // Lifts
    const totalLifts = await question('Total Lifts: ');
    const gondolas = await question('Gondolas: ') || '0';
    const highSpeedSixPack = await question('High-Speed Six-Packs: ') || '0';
    const highSpeedQuads = await question('High-Speed Quads: ') || '0';
    const quadChairs = await question('Quad Chairs: ') || '0';
    const tripleChairs = await question('Triple Chairs: ') || '0';
    const doubleChairs = await question('Double Chairs: ') || '0';
    const surfaceLifts = await question('Surface Lifts: ') || '0';
    
    // Trails
    const totalTrails = await question('Total Trails: ');
    const beginnerTrails = await question('Beginner Trails: ') || '0';
    const intermediateTrails = await question('Intermediate Trails: ') || '0';
    const advancedTrails = await question('Advanced Trails: ') || '0';
    const expertTrails = await question('Expert Trails: ') || '0';
    
    // Season
    const seasonStart = await question('Season Start (e.g., "Late November"): ') || 'Late November';
    const seasonEnd = await question('Season End (e.g., "Early April"): ') || 'Early April';
    const averageSnowfall = await question('Average Annual Snowfall (inches): ') || '0';
    
    // Travel
    const nearestAirport = await question('Nearest Airport: ') || '';
    const airportDistance = await question('Airport Distance: ') || '';
    const drivingDirections = await question('Driving Directions: ') || '';
    
    const featured = (await question('Featured Resort? (y/n): ')).toLowerCase() === 'y';
    const restaurantCount = await question('Restaurant Count (number, or 0): ') || '0';
    
    const id = generateId(name);
    
    return {
        id,
        name,
        location,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
        description: description || `Description for ${name} in ${location}.`,
        image: `/images/resorts/${id}.jpg`,
        logo: `/images/resorts/logos/${id}.png`,
        restaurantCount: parseInt(restaurantCount) || 0,
        featured,
        terrain: {
            skiableAcres: parseInt(skiableAcres) || 0,
            verticalDrop: parseInt(verticalDrop) || 0,
            baseElevation: parseInt(baseElevation) || 0,
            summitElevation: parseInt(summitElevation) || 0,
            snowmakingCoverage: 'Extensive'
        },
        lifts: {
            total: parseInt(totalLifts) || 0,
            types: {
                gondolas: parseInt(gondolas) || 0,
                highSpeedSixPack: parseInt(highSpeedSixPack) || 0,
                highSpeedQuads: parseInt(highSpeedQuads) || 0,
                quadChairs: parseInt(quadChairs) || 0,
                tripleChairs: parseInt(tripleChairs) || 0,
                doubleChairs: parseInt(doubleChairs) || 0,
                surfaceLifts: parseInt(surfaceLifts) || 0
            },
            notable: '',
            hourlyCapacity: 0
        },
        trails: {
            total: parseInt(totalTrails) || 0,
            beginner: parseInt(beginnerTrails) || 0,
            intermediate: parseInt(intermediateTrails) || 0,
            advanced: parseInt(advancedTrails) || 0,
            expert: parseInt(expertTrails) || 0,
            longestRun: '',
            terrainParks: 0,
            superpipe: false,
            halfpipes: false,
            bowls: false,
            woodedAreas: true,
            nightSkiing: false
        },
        season: {
            start: seasonStart,
            end: seasonEnd,
            averageSnowfall: parseInt(averageSnowfall) || 0
        },
        travel: {
            nearestAirport: nearestAirport || '',
            airportDistance: airportDistance || '',
            drivingDirections: drivingDirections || '',
            shuttleService: ''
        },
        platformReviews: {}
    };
}

function formatResortObject(resort) {
    const indent = '            ';
    let output = `        {\n`;
    output += `${indent}id: '${resort.id}',\n`;
    output += `${indent}name: '${resort.name}',\n`;
    output += `${indent}location: '${resort.location}',\n`;
    output += `${indent}coordinates: { lat: ${resort.coordinates.lat}, lng: ${resort.coordinates.lng} },\n`;
    output += `${indent}description: '${resort.description.replace(/'/g, "\\'")}',\n`;
    output += `${indent}image: '${resort.image}',\n`;
    output += `${indent}logo: '${resort.logo}',\n`;
    output += `${indent}restaurantCount: ${resort.restaurantCount},\n`;
    output += `${indent}featured: ${resort.featured},\n`;
    output += `${indent}terrain: {\n`;
    output += `${indent}    skiableAcres: ${resort.terrain.skiableAcres},\n`;
    output += `${indent}    verticalDrop: ${resort.terrain.verticalDrop},\n`;
    output += `${indent}    baseElevation: ${resort.terrain.baseElevation},\n`;
    output += `${indent}    summitElevation: ${resort.terrain.summitElevation},\n`;
    output += `${indent}    snowmakingCoverage: '${resort.terrain.snowmakingCoverage}'\n`;
    output += `${indent}},\n`;
    output += `${indent}lifts: {\n`;
    output += `${indent}    total: ${resort.lifts.total},\n`;
    output += `${indent}    types: {\n`;
    output += `${indent}        gondolas: ${resort.lifts.types.gondolas},\n`;
    output += `${indent}        highSpeedSixPack: ${resort.lifts.types.highSpeedSixPack},\n`;
    output += `${indent}        highSpeedQuads: ${resort.lifts.types.highSpeedQuads},\n`;
    output += `${indent}        quadChairs: ${resort.lifts.types.quadChairs},\n`;
    output += `${indent}        tripleChairs: ${resort.lifts.types.tripleChairs},\n`;
    output += `${indent}        doubleChairs: ${resort.lifts.types.doubleChairs},\n`;
    output += `${indent}        surfaceLifts: ${resort.lifts.types.surfaceLifts}\n`;
    output += `${indent}    },\n`;
    output += `${indent}    notable: '${resort.lifts.notable}',\n`;
    output += `${indent}    hourlyCapacity: ${resort.lifts.hourlyCapacity}\n`;
    output += `${indent}},\n`;
    output += `${indent}trails: {\n`;
    output += `${indent}    total: ${resort.trails.total},\n`;
    output += `${indent}    beginner: ${resort.trails.beginner},\n`;
    output += `${indent}    intermediate: ${resort.trails.intermediate},\n`;
    output += `${indent}    advanced: ${resort.trails.advanced},\n`;
    output += `${indent}    expert: ${resort.trails.expert},\n`;
    output += `${indent}    longestRun: '${resort.trails.longestRun}',\n`;
    output += `${indent}    terrainParks: ${resort.trails.terrainParks},\n`;
    output += `${indent}    superpipe: ${resort.trails.superpipe},\n`;
    output += `${indent}    halfpipes: ${resort.trails.halfpipes},\n`;
    output += `${indent}    bowls: ${resort.trails.bowls},\n`;
    output += `${indent}    woodedAreas: ${resort.trails.woodedAreas},\n`;
    output += `${indent}    nightSkiing: ${resort.trails.nightSkiing}\n`;
    output += `${indent}},\n`;
    output += `${indent}season: {\n`;
    output += `${indent}    start: '${resort.season.start}',\n`;
    output += `${indent}    end: '${resort.season.end}',\n`;
    output += `${indent}    averageSnowfall: ${resort.season.averageSnowfall}\n`;
    output += `${indent}},\n`;
    output += `${indent}travel: {\n`;
    output += `${indent}    nearestAirport: '${resort.travel.nearestAirport}',\n`;
    output += `${indent}    airportDistance: '${resort.travel.airportDistance}',\n`;
    output += `${indent}    drivingDirections: '${resort.travel.drivingDirections}',\n`;
    output += `${indent}    shuttleService: '${resort.travel.shuttleService}'\n`;
    output += `${indent}},\n`;
    output += `${indent}platformReviews: {}\n`;
    output += `        }`;
    
    return output;
}

async function addResortToFile(resort) {
    try {
        // Read the current data.js file
        let data = fs.readFileSync(DATA_FILE, 'utf8');
        
        // Find the end of the resorts array (before the closing bracket)
        // Look for the last resort entry and add our new one before the closing bracket
        const lastResortPattern = /(\s+)(\},\s*)(\n\s*\]\s*;)/;
        const match = data.match(lastResortPattern);
        
        if (!match) {
            // Try alternative pattern - look for the closing bracket of resorts array
            const altPattern = /(\},\s*\n\s*)(\]\s*;)/;
            const altMatch = data.match(altPattern);
            
            if (altMatch) {
                const newResort = formatResortObject(resort);
                data = data.replace(altPattern, `},\n        ${newResort}\n    ];`);
            } else {
                throw new Error('Could not find insertion point in data.js');
            }
        } else {
            const newResort = formatResortObject(resort);
            data = data.replace(lastResortPattern, `$1$2$1${newResort}\n$1$3`);
        }
        
        // Write back to file
        fs.writeFileSync(DATA_FILE, data, 'utf8');
        console.log(`\n✅ Successfully added ${resort.name} to data.js`);
        console.log(`   Resort ID: ${resort.id}`);
        
    } catch (error) {
        console.error('Error adding resort:', error);
        throw error;
    }
}

async function main() {
    try {
        const resort = await getResortData();
        
        console.log('\n=== Resort Summary ===');
        console.log(JSON.stringify(resort, null, 2));
        
        const confirm = await question('\nAdd this resort to data.js? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            console.log('Cancelled.');
            rl.close();
            return;
        }
        
        await addResortToFile(resort);
        rl.close();
        
    } catch (error) {
        console.error('Error:', error);
        rl.close();
        process.exit(1);
    }
}

main();






