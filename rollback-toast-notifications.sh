#!/bin/bash

# Script to rollback changes made by update-toast-notifications.sh
# This will restore react-toastify imports and usage

echo "Rolling back toast notification changes across the application..."

# Find all JS/JSX files that use our useToast hook
FILES=$(grep -l "import { useToast } from '@/Hooks/useToast'" $(find ./resources/js -name "*.jsx" -o -name "*.js"))

for FILE in $FILES; do
  echo "Processing file: $FILE"
  
  # Check if this file previously used react-toastify (to avoid modifying files that always used useToast)
  if grep -q "success, error, warning, info" "$FILE"; then
    # Replace useToast imports with react-toastify
    sed -i '' "s/import { useToast } from '@\/Hooks\/useToast';/import { toast } from 'react-toastify';/g" "$FILE"
    
    # Add back react-toastify CSS import if it's not a component file
    if ! echo "$FILE" | grep -q "Components"; then
      sed -i '' "/import { toast } from 'react-toastify';/a\\
import 'react-toastify\/dist\/ReactToastify.css';" "$FILE"
    fi
    
    # Remove the useToast hook initialization
    sed -i '' "/const { success, error, warning, info } = useToast();/d" "$FILE"
    
    # Replace our methods with toast calls
    sed -i '' "s/success(\([^)]*\))/toast.success(\1)/g" "$FILE"
    sed -i '' "s/error(\([^)]*\))/toast.error(\1)/g" "$FILE"
    sed -i '' "s/warning(\([^)]*\))/toast.warning(\1)/g" "$FILE"
    sed -i '' "s/info(\([^)]*\))/toast.info(\1)/g" "$FILE"
    
    # Add back ToastContainer component before the closing div if it's a layout file
    if echo "$FILE" | grep -q "Layout"; then
      sed -i '' "/<\/div>/i\\
            {/* Toast notifications */}\\
            <ToastContainer\\
                position=\"top-right\"\\
                autoClose={5000}\\
                hideProgressBar={false}\\
                newestOnTop\\
                closeOnClick\\
                rtl={false}\\
                pauseOnFocusLoss\\
                draggable\\
                pauseOnHover\\
            />" "$FILE"
      
      # Fix the ToastContainer import
      sed -i '' "s/import { toast } from 'react-toastify';/import { ToastContainer, toast } from 'react-toastify';/g" "$FILE"
    fi
  fi
done

# Special case for AuthenticatedLayout.jsx - remove the Toaster component
if [ -f ./resources/js/Layouts/AuthenticatedLayout.jsx ]; then
  echo "Restoring AuthenticatedLayout.jsx"
  sed -i '' "/import { Toaster } from 'react-hot-toast';/d" "./resources/js/Layouts/AuthenticatedLayout.jsx"
  sed -i '' "/<Toaster position=\"top-right\" \/>/d" "./resources/js/Layouts/AuthenticatedLayout.jsx"
fi

echo "✅ Rolled back toast notification changes in all files!"
echo ""
echo "⚠️ NOTE: You may need to manually fix some files if they don't look right."
echo "Run 'npm install react-toastify' if you need to reinstall the package."
