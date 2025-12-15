# Quick Start: Adding Restaurants

## 🚀 Fastest Way to Add a Restaurant

### Option 1: Interactive Generator (Recommended)
```bash
# Step 1: Generate restaurant data
node generate-restaurant-data.js > new-restaurant.json

# Step 2: Insert it into data.js automatically
node insert-restaurant.js new-restaurant.json
```

### Option 2: Manual Template
```bash
# Step 1: Copy the template
cp restaurant-template.json my-restaurant.json

# Step 2: Edit my-restaurant.json with your restaurant info

# Step 3: Validate distance
node add-restaurant-validator.js <lat> <lng> <resort-id>

# Step 4: Insert into data.js
node insert-restaurant.js my-restaurant.json
```

## 📋 Required Information

Before you start, gather:
- ✅ Restaurant name
- ✅ Address (for coordinates)
- ✅ Coordinates (lat/lng) - get from Google Maps
- ✅ Resort ID (check data.js or run validator)
- ✅ Description
- ✅ Category (restaurant/bar/cafe)
- ✅ Cuisine type
- ✅ Price range ($/$$/$$$/$$$$)
- ✅ Phone number
- ✅ Website URL

## 🔍 Quick Validation

```bash
# Check if location is valid (within 40 miles)
node add-restaurant-validator.js 39.5080 -79.3800 wisp-resort
```

## ✅ Verify Everything Works

```bash
# Check all restaurants are valid
node validate-restaurant-distances.js --report-only

# Test the page (open in browser)
# restaurant-detail.html?id=<your-restaurant-id>
```

## 📝 Current Status

- **Total Restaurants:** 9
- **All Valid:** ✅ Yes (all within 40 miles)
- **Resorts Covered:** Wisp Resort

## 🎯 Next Steps

1. Use `generate-restaurant-data.js` to create new restaurants
2. Use `insert-restaurant.js` to add them automatically
3. Test each restaurant page
4. Update resort `restaurantCount` if needed

## 💡 Tips

- **Use the generator** - It validates distance automatically
- **Save JSON files** - Keep backups of restaurant data
- **Test immediately** - Check the page right after adding
- **Batch add** - Create multiple JSON files and insert them one by one



