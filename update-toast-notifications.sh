#!/bin/bash

# Script to update toast references in the codebase
# This will replace react-toastify imports with our centralized useToast hook

echo "Updating toast notifications across the application..."

# Find all JS/JSX files that use react-toastify
FILES=$(grep -l "import.*toast.*from 'react-toastify'" $(find ./resources/js -name "*.jsx" -o -name "*.js"))

for FILE in $FILES; do
  echo "Processing file: $FILE"
  
  # Replace react-toastify imports with useToast
  sed -i '' "s/import { toast } from 'react-toastify';/import { useToast } from '@\/Hooks\/useToast';/g" "$FILE"
  sed -i '' "s/import { ToastContainer, toast } from 'react-toastify';/import { useToast } from '@\/Hooks\/useToast';/g" "$FILE"
  
  # Remove react-toastify CSS import
  sed -i '' "/import 'react-toastify\/dist\/ReactToastify.css';/d" "$FILE"
  
  # Add useToast hook to component functions
  sed -i '' "/const {.*} = useForm(/a\\
    const { success, error, warning, info } = useToast();" "$FILE"
  
  # Replace toast calls with our methods
  sed -i '' "s/toast\.success(\(.*\))/success(\1)/g" "$FILE"
  sed -i '' "s/toast\.error(\(.*\))/error(\1)/g" "$FILE"
  sed -i '' "s/toast\.warning(\(.*\))/warning(\1)/g" "$FILE"
  sed -i '' "s/toast\.info(\(.*\))/info(\1)/g" "$FILE"
  
  # Remove ToastContainer component
  sed -i '' "/<ToastContainer/,/<\/ToastContainer>/d" "$FILE"
done

echo "✅ Updated toast notifications in all files!"
echo ""
echo "⚠️ NOTE: You may need to manually fix some files where the script couldn't detect the right pattern."
echo "Run a search for any remaining 'toast.' references and update them manually."
