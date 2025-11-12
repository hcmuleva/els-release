#!/bin/sh
set -e

echo "📦 Generating runtime environment configuration..."

# Create a JS file that sets global variables on window object
cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL}"
};
EOF

echo "✅ Runtime environment file created: /usr/share/nginx/html/env-config.js"
