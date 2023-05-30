#!/bin/bash

git checkout develop
git branch -D production; 
git branch -D production-backup; 
git fetch; 
git checkout production; 
git checkout -b production-backup; 
git branch -D production; 
git checkout develop; git checkout -b production; 
git push --force origin production;