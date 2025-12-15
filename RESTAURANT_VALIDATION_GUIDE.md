# Restaurant Distance Validation Guide

This guide helps you ensure all restaurants are within 40 miles of their associated resort.

## Tools

### 1. `validate-restaurant-distances.js`
Validates all existing restaurants in `data.js` and generates a report.

**Usage:**
```bash
# Generate a report only (no changes)
node validate-restaurant-distances.js --report-only

# Filter data.js to only include restaurants within 40 miles
node validate-restaurant-distances.js --filter
```

**What it does:**
- Checks all restaurants against their associated resorts
- Calculates distances using the Haversine formula
- Reports which restaurants are valid/invalid
- Can filter `data.js` to remove restaurants beyond 40 miles (creates a backup first)

**Example output:**
```
================================================================================
RESTAURANT DISTANCE VALIDATION REPORT
================================================================================
Maximum allowed distance: 40 miles

Total restaurants: 9
✅ Valid (within 40 miles): 9
❌ Invalid (beyond 40 miles): 0
```

### 2. `add-restaurant-validator.js`
Validates a single restaurant before adding it to the data.

**Usage:**
```bash
node add-restaurant-validator.js <restaurant-lat> <restaurant-lng> <resort-id>
```

**Example:**
```bash
node add-restaurant-validator.js 39.5080 -79.3800 wisp-resort
```

**What it does:**
- Validates that a restaurant's coordinates are within 40 miles of the specified resort
- Shows the calculated distance
- Returns exit code 0 if valid, 1 if invalid

## Finding Restaurant Coordinates

1. Open Google Maps
2. Search for the restaurant
3. Right-click on the location marker
4. Click on the coordinates (e.g., "39.5080, -79.3800") to copy them

## Adding New Restaurants

1. **Find the restaurant coordinates** (see above)
2. **Identify the resort ID** from `data.js` (e.g., `wisp-resort`, `vail`, `whistler-blackcomb`)
3. **Validate the distance:**
   ```bash
   node add-restaurant-validator.js <lat> <lng> <resort-id>
   ```
4. **If valid**, add the restaurant to `data.js` following the existing format
5. **Run the full validation** to ensure everything is correct:
   ```bash
   node validate-restaurant-distances.js --report-only
   ```

## Restaurant Data Structure

When adding a restaurant to `data.js`, ensure it includes:

```javascript
{
    id: 'restaurant-id',
    name: 'Restaurant Name',
    location: 'City, State',
    coordinates: { lat: 39.5080, lng: -79.3800 },
    description: 'Restaurant description...',
    category: 'restaurant', // or 'bar', 'cafe'
    cuisine: 'American',
    priceRange: '$$',
    rating: 4.3,
    reviewCount: 245,
    resort: 'wisp-resort', // Must match a resort ID
    address: 'Full address',
    phone: '(301) 123-4567',
    website: 'https://example.com',
    // ... other fields
}
```

## Important Notes

- **All restaurants must be within 40 miles of their associated resort**
- The validation uses the Haversine formula for accurate distance calculation
- When using `--filter`, a backup of `data.js` is automatically created
- Restaurant coordinates and resort coordinates are both required for validation

## Troubleshooting

**"Resort not found" error:**
- Check that the resort ID matches exactly (case-sensitive)
- List all available resorts by running the validator with an invalid ID

**"Missing coordinates" error:**
- Ensure both the restaurant and resort have `coordinates: { lat: X, lng: Y }`
- Coordinates must be valid numbers

**Distance seems wrong:**
- The Haversine formula calculates "as the crow flies" distance
- This is the shortest distance between two points on Earth
- Actual driving distance may be longer



