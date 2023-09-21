#!/bin/env bash

mv apps/docs/docs-dist docs-dist
mv packages/cocoa-discord/docs-dist/typedoc docs-dist/typedoc
mv packages/music-module/docs-dist/typedoc-music docs-dist/typedoc-music
touch docs-dist/.nojekyll
rmdir packages/cocoa-discord/docs-dist
