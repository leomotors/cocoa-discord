#!/bin/env bash

mv apps/docs/dist docs-dist
mv packages/cocoa-discord/docs-dist/typedoc docs-dist
touch docs-dist/.nojekyll
rmdir packages/cocoa-discord/docs-dist
