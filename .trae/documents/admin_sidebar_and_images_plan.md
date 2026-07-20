
# Admin Sidebar Icons & Larger Product Images Plan

## Changes Overview

1. **Make product photos bigger in edit section** - Increase preview image size
2. **Add icons to sidebar navigation** - Add relevant SVG icons to each nav item and ensure they display when collapsed

## Files to Edit

1. `forma/src/components/admin/AdminPanel.tsx` - Add icons to sidebar navigation items
2. `forma/src/styles/forma.css` - Increase product preview image size

## Step-by-Step Implementation

### Step 1: Update Product Preview Image Size
* Edit `.upload-preview-item` CSS class in `forma.css` to increase width and height
* Also increase the size of the delete button slightly to match

### Step 2: Add Icons to Sidebar Navigation
* For each admin navigation button (dashboard, products, blog, gallery) add an SVG icon
* Icons should be visible both in expanded and collapsed states
* Use appropriate icons for each page type

## Style Guidelines
* Match existing icon style (line-art style similar to collapse button)
* Keep icon size consistent
* Maintain existing color transitions
