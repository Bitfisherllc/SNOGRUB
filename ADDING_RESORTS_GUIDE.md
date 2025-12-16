# Guide to Adding Ski Resorts

This guide explains how to add new ski resorts to your database.

## Quick Start

### Option 1: Interactive Script (Recommended)

Use the interactive script to add resorts one at a time:

```bash
node add-resort.js
```

The script will prompt you for all the necessary information and add the resort to `data.js`.

### Option 2: Manual Addition

Manually add resorts to `data.js` following the structure below.

## Resort Data Structure

Each resort in `data.js` follows this structure:

```javascript
{
    id: 'resort-id',                    // URL-friendly ID (auto-generated from name)
    name: 'Resort Name',                // Full resort name
    location: 'City, State, USA',        // Location string
    coordinates: { lat: 0.0, lng: 0.0 }, // GPS coordinates
    description: 'Long description...',  // Detailed description (2-3 paragraphs)
    image: '/images/resorts/resort-id.jpg',
    logo: '/images/resorts/logos/resort-id.png',
    restaurantCount: 0,                  // Number of restaurants
    featured: false,                     // Featured resort flag
    terrain: {
        skiableAcres: 0,
        verticalDrop: 0,
        baseElevation: 0,
        summitElevation: 0,
        snowmakingCoverage: 'Extensive' // or 'Moderate' or 'Limited'
    },
    lifts: {
        total: 0,
        types: {
            gondolas: 0,
            highSpeedSixPack: 0,
            highSpeedQuads: 0,
            quadChairs: 0,
            tripleChairs: 0,
            doubleChairs: 0,
            surfaceLifts: 0
        },
        notable: '',                     // Notable lift names
        hourlyCapacity: 0                // Total hourly capacity
    },
    trails: {
        total: 0,
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0,
        longestRun: '',                  // e.g., "3.5 miles"
        terrainParks: 0,
        superpipe: false,
        halfpipes: false,
        bowls: false,
        woodedAreas: true,
        nightSkiing: false
    },
    season: {
        start: 'Late November',          // Season start
        end: 'Early April',              // Season end
        averageSnowfall: 0               // Inches per year
    },
    travel: {
        nearestAirport: '',
        airportDistance: '',
        drivingDirections: '',
        shuttleService: ''
    },
    platformReviews: {}                  // Can be populated later
}
```

## Where to Find Resort Information

### Coordinates (Latitude/Longitude)
- Google Maps: Right-click on location → Coordinates
- Resort's official website (often in contact/footer)
- Wikipedia page for the resort

### Resort Statistics
- Official resort website (usually under "Mountain Info" or "About")
- Wikipedia page
- Ski resort review sites (OnTheSnow, SkiResort.info, etc.)

### Key Information to Gather

1. **Basic Info:**
   - Resort name
   - Location (city, state)
   - Coordinates

2. **Terrain:**
   - Skiable acres
   - Vertical drop (feet)
   - Base elevation (feet)
   - Summit elevation (feet)

3. **Lifts:**
   - Total number of lifts
   - Breakdown by type (gondolas, high-speed quads, etc.)
   - Notable lifts (e.g., "Peak 2 Peak Gondola")

4. **Trails:**
   - Total trails
   - Breakdown by difficulty
   - Longest run
   - Terrain parks
   - Special features (bowls, night skiing, etc.)

5. **Season:**
   - Typical opening date
   - Typical closing date
   - Average annual snowfall

6. **Travel:**
   - Nearest airport
   - Distance from airport
   - Driving directions
   - Shuttle services

## Adding Resorts Manually

1. Open `data.js` in your editor
2. Find the `resorts` array (starts around line 3)
3. Locate the last resort entry (before the closing `]`)
4. Add a comma after the last resort's closing brace
5. Add your new resort object following the structure above
6. Make sure the JSON syntax is correct (commas, quotes, etc.)

## Priority Resorts to Add

Based on the missing resorts analysis, here are the highest priority resorts to add:

### Tier 1 (Major Destination Resorts)
1. **Sugarloaf** - Carrabassett Valley, Maine
2. **Sunday River** - Newry, Maine
3. **Loon Mountain** - Lincoln, New Hampshire
4. **Whiteface Mountain** - Wilmington, New York
5. **Stratton Mountain** - Stratton, Vermont
6. **Powder Mountain** - Eden, Utah
7. **Snowbasin** - Huntsville, Utah
8. **Grand Targhee** - Alta, Wyoming
9. **Whitefish Mountain** - Whitefish, Montana
10. **Mt. Bachelor** - Bend, Oregon
11. **Crystal Mountain** - Enumclaw, Washington
12. **Stevens Pass** - Skykomish, Washington
13. **Mt. Hood Meadows** - Government Camp, Oregon
14. **Timberline Lodge** - Government Camp, Oregon
15. **Schweitzer Mountain** - Sandpoint, Idaho

See `MISSING_RESORTS_SUMMARY.md` for the complete list.

## Verification

After adding a resort:

1. Run the list script to verify:
   ```bash
   node list-resorts.js
   ```

2. Check that the resort appears in the list

3. Test in your application to ensure it displays correctly

## Tips

- **Start with high-priority resorts** from the missing resorts list
- **Gather all information first** before adding to avoid incomplete entries
- **Use the interactive script** for easier data entry
- **Double-check coordinates** - incorrect coordinates will break maps
- **Keep descriptions consistent** with existing resort descriptions (2-3 paragraphs, similar style)
- **Set `restaurantCount: 0`** initially - you can add restaurants later
- **Set `featured: false`** unless it's a major destination resort

## Next Steps

After adding resorts:
1. Add restaurant data for each resort (see `ADDING_RESTAURANTS_GUIDE.md`)
2. Add resort images and logos to `/images/resorts/`
3. Update any resort count displays in your application

## Need Help?

- Check existing resort entries in `data.js` for examples
- Use the interactive script (`node add-resort.js`) for guided entry
- Refer to `MISSING_SKI_RESORTS_USA.md` for comprehensive resort lists






