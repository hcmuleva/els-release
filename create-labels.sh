#!/bin/bash

# Define labels and colors
declare -A labels
labels["major"]="b60205"       # Red
labels["minor"]="d93f0b"       # Orange
labels["patch"]="0e8a16"       # Green
labels["feature"]="1d76db"     # Blue
labels["enhancement"]="a2eeef" # Light Blue
labels["fix"]="d93f0b"         # Red
labels["bug"]="d73a4a"         # Red
labels["chore"]="ededed"       # Grey
labels["documentation"]="0075ca" # Blue
labels["dependencies"]="006b75" # Teal

# Check if gh cli is installed
if ! command -v gh &> /dev/null; then
    echo "Error: 'gh' CLI is not installed. Please install it first."
    exit 1
fi

echo "Creating/Updating labels..."

for label in "${!labels[@]}"; do
    color="${labels[$label]}"
    echo "Processing label: $label (Color: #$color)"
    
    # Try to create label, if it exists, update it
    if gh label list | grep -q "^$label\s"; then
        gh label edit "$label" --color "$color" --description "Category: $label"
    else
        gh label create "$label" --color "$color" --description "Category: $label"
    fi
done

echo "Done!"
