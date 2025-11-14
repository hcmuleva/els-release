#!/bin/bash

# Configuration
INPUT_DIR="${1:-.}"  # Use provided directory or current directory
OUTPUT_FILE="all_files.txt"
EXCLUDE_FILE="${2:-exclude_patterns.txt}"  # Exclusion patterns file

# Create default exclusion file if it doesn't exist
if [ ! -f "$EXCLUDE_FILE" ]; then
    cat > "$EXCLUDE_FILE" << 'EOF'
# File patterns to exclude
*.md
*.sh
Makefile
*.png
*.md
*.tgz
*.jpg
*.jpeg
*.gif
*.pdf
*.zip
*.tar
*.gz
*.o
*.obj
*.exe
*.dll
*.bin
*.ttf
*.woff
*.woff2
*.class
*.jar
*.log
.DS_Store
*.pyc
__pycache__
*.egg-info
*.so
*.dylib
*.a
EOF
    echo "Created default exclusion file: $EXCLUDE_FILE"
fi

# Read binary extensions from exclusion file
BINARY_EXTENSIONS=$(grep -v '^#' "$EXCLUDE_FILE" | grep -v '^$' | tr '\n' ' ')

echo "Input directory: $INPUT_DIR"
echo "Output file: $OUTPUT_FILE"
echo "Exclusion file: $EXCLUDE_FILE"
echo "Binary extensions: $BINARY_EXTENSIONS"

# Build find command with exclusions from file
find_command="find \"$INPUT_DIR\" -type f ! -name \"$OUTPUT_FILE\" ! -path \"*/node_modules/*\""

# Add exclusions from file
while IFS= read -r pattern; do
    # Skip comments and empty lines
    [[ "$pattern" =~ ^# ]] || [[ -z "$pattern" ]] && continue
    find_command="$find_command ! -name \"$pattern\""
done < "$EXCLUDE_FILE"

# Execute find and process files
eval "$find_command -print0" | while IFS= read -r -d '' file; do
    if [ -r "$file" ]; then
        # Check if the file extension matches any of the binary extensions
        skip=false
        for ext in $BINARY_EXTENSIONS; do
            # Remove asterisk and check extension
            clean_ext="${ext#\*}"
            if [[ "$file" =~ ${clean_ext}$ ]]; then
                skip=true
                break
            fi
        done

        if [ "$skip" = true ]; then
            echo "--- FILE: $file --- (binary, skipped)"
        else
            echo "--- FILE: $file ---"
            cat "$file"
            echo ""
        fi
    else
        echo "--- FILE: $file --- (unreadable, skipped)"
    fi
done > "$OUTPUT_FILE"

echo "File listing complete: $OUTPUT_FILE"