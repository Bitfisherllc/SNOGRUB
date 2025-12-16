# Batch Adding Restaurants Guide

## Quick Batch Add

You can add multiple restaurants at once using the batch insert script.

## Method 1: Using Example Files

We've created example restaurant files for popular resorts:

```bash
# Add restaurants to Whistler Blackcomb
node batch-insert-restaurants.js example-restaurants-whistler.json

# Add restaurants to Vail
node batch-insert-restaurants.js example-restaurants-vail.json

# Add restaurants to Park City
node batch-insert-restaurants.js example-restaurants-park-city.json
```

## Method 2: Create Your Own Batch File

1. **Create a JSON file** with an array of restaurants:

```json
[
    {
        "id": "restaurant-1",
        "name": "Restaurant Name",
        "location": "City, State",
        "coordinates": { "lat": 0.0, "lng": 0.0 },
        "description": "Description...",
        "category": "restaurant",
        "cuisine": "Cuisine Type",
        "priceRange": "$$",
        "rating": 4.0,
        "reviewCount": 100,
        "resort": "resort-id",
        "address": "Full Address",
        "phone": "(XXX) XXX-XXXX",
        "website": "https://example.com"
    },
    {
        "id": "restaurant-2",
        "name": "Another Restaurant",
        ...
    }
]
```

2. **Validate distances first** (optional but recommended):

```bash
# Check each restaurant
node add-restaurant-validator.js <lat> <lng> <resort-id>
```

3. **Insert the batch**:

```bash
node batch-insert-restaurants.js your-restaurants.json
```

## Example Batch File Structure

```json
[
    {
        "id": "restaurant-id-1",
        "name": "Restaurant Name 1",
        "location": "City, State",
        "coordinates": { "lat": 39.5080, "lng": -79.3800 },
        "description": "Restaurant description...",
        "category": "restaurant",
        "cuisine": "American",
        "priceRange": "$$",
        "rating": 4.3,
        "reviewCount": 245,
        "resort": "wisp-resort",
        "address": "123 Main St, City, State 12345",
        "phone": "(301) 123-4567",
        "website": "https://example.com",
        "hours": {
            "monday": "11:00 AM - 10:00 PM",
            "tuesday": "11:00 AM - 10:00 PM"
        }
    },
    {
        "id": "restaurant-id-2",
        "name": "Restaurant Name 2",
        ...
    }
]
```

## Batch Insert Process

The batch script will:
1. ✅ Validate each restaurant
2. ✅ Check distances automatically
3. ✅ Create backups
4. ✅ Insert each restaurant one by one
5. ✅ Report success/failure for each
6. ✅ Provide a summary at the end

## Tips for Batch Adding

1. **Validate first** - Use `add-restaurant-validator.js` to check distances before creating batch files
2. **Start small** - Test with 2-3 restaurants first
3. **Keep backups** - The script creates backups, but keep your JSON files too
4. **Check results** - Run `validate-restaurant-distances.js --report-only` after batch insert
5. **Test pages** - Visit each restaurant detail page to verify

## Example Workflow

```bash
# 1. Create batch file (edit example files or create new)
# Edit example-restaurants-whistler.json

# 2. Validate distances (optional)
node add-restaurant-validator.js 50.1163 -122.9574 whistler-blackcomb

# 3. Insert batch
node batch-insert-restaurants.js example-restaurants-whistler.json

# 4. Verify all restaurants
node validate-restaurant-distances.js --report-only

# 5. Test a restaurant page
# Open: restaurant-detail.html?id=bearfoot-bistro
```

## Available Example Files

- `example-restaurants-whistler.json` - 2 restaurants for Whistler Blackcomb
- `example-restaurants-vail.json` - 2 restaurants for Vail
- `example-restaurants-park-city.json` - 2 restaurants for Park City

You can:
- Use them as-is (after validating distances)
- Edit them to add more restaurants
- Use them as templates for other resorts

## Troubleshooting

**"Restaurant already exists" error:**
- The restaurant ID is already in data.js
- Change the ID in your batch file

**"Distance validation failed":**
- Restaurant is beyond 40 miles
- Check coordinates are correct
- Verify resort coordinates

**"Invalid JSON" error:**
- Check your JSON syntax
- Use a JSON validator
- Ensure it's an array `[...]`

## Next Steps After Batch Insert

1. ✅ Run validation: `node validate-restaurant-distances.js --report-only`
2. ✅ Test restaurant pages
3. ✅ Update resort `restaurantCount` in data.js if needed
4. ✅ Add more restaurants to other resorts






