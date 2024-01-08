#!/bin/bash

# deploy.sh: A script to add, commit, and push changes to GitHub.

# Check if a commit message was supplied
if [ "$#" -eq 0 ]; then
    echo "Error: No commit message provided."
    echo "Usage: ./deploy.sh \"Your commit message\""
    exit 1
fi

# Assign the first argument as the commit message
COMMIT_MESSAGE="$1"

# Git add changes
echo "Adding changes..."
git add .

# Git commit
echo "Committing changes..."
git commit -m "$COMMIT_MESSAGE"

# Git push
echo "Pushing changes to GitHub..."
git push origin main

echo "Deployment complete."
