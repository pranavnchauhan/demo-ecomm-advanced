#!/bin/bash
cd /vercel/share/v0-project
pnpm install 2>&1
echo "--- Install complete ---"
echo "node_modules exists: $(test -d node_modules && echo true || echo false)"
echo "next exists: $(test -d node_modules/next && echo true || echo false)"
echo "react exists: $(test -d node_modules/react && echo true || echo false)"
