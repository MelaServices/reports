#!/bin/bash

echo "Staging all changes..."
git add .

echo "Committing changes..."
git commit -m "Automated force push: Overwriting remote with local changes"

echo "Force pushing to remote repository..."
git push --force-with-lease

echo "Operation complete. Remote repository has been overwritten with local changes."