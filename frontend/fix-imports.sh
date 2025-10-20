#!/bin/bash
find src/components/ui -type f -name "*.jsx" -exec sed -i 's|from "@/lib/utils"|from "../../lib/utils"|g' {} +