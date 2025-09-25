#!/bin/bash

# Storyblok Data Seeding Setup
# This script loads environment variables from .env and runs the Storyblok seeding script

echo "Setting up Storyblok environment..."

# 1) Install dependencies
echo "Installing Python dependencies..."
python3 -m pip install requests

# 2) Load environment variables from .env file
if [ -f ".env" ]; then
    echo "Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
else
    echo "ERROR: .env file not found. Please create one based on .env.example"
    exit 1
fi

# Check if required variables are set
if [ -z "$SB_SPACE_ID" ] || [ -z "$SB_PAT" ]; then
    echo "ERROR: Missing required environment variables SB_SPACE_ID or SB_PAT in .env file"
    exit 1
fi

echo "Environment variables loaded successfully"

# 3) Run the seeding script
echo "Running Storyblok seeding script..."
python3 storyblok_seed.py

echo "Storyblok setup complete!"