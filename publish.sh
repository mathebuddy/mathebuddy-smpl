#!/bin/bash
npm run build
npm login
npm publish --access public
npm logout
