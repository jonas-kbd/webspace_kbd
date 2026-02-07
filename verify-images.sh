#!/bin/bash
ERRORS=0
cd /Users/jonas/Documents/webspace_kbd

echo "=== Checking Image References ==="

for html in *.html; do
    echo ""
    echo "Checking $html..."

    # Extract all image src from img tags
    grep -o 'src="images/[^"]*"' "$html" | sed 's/src="//;s/"//' | while read -r img; do
        if [ ! -f "$img" ]; then
            echo "  ❌ MISSING: $img"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✓ Found: $img"
        fi
    done
done

if [ $ERRORS -eq 0 ]; then
    echo ""
    echo "✅ All image references are valid!"
else
    echo ""
    echo "⚠️  Found $ERRORS broken image references"
    exit 1
fi
