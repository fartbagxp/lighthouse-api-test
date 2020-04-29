#!/usr/bin/env bash

while true; do node index.js; sleep 60; done 2>&1 | tee data/$(date "+%Y%m%d-%H%M%S").txt