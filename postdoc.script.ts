import chalk from "chalk";
import * as fs from "fs";
import globby from "globby";
import hljs from "highlight.js";
import { marked } from "marked";
import path from "path";

function convertLink(atag: string, file: string) {
    const link = atag.split('"')[1];

    if (!link.startsWith("..") || link.endsWith(".md")) {
        return atag.replace(".md", ".html");
    }

    const root = path.join(file, "../" + link);

    return `<a href="https://github.com/Leomotors/cocoa-discord-utils/blob/main/${root}">`;
}

function workOn(file: string) {
    const ftoken = file.split("/");
    const root = ftoken.slice(0, ftoken.length - 1).join("/");

    const content = fs.readFileSync(file).toString();

    const html = marked(content, {
        highlight(code, lang) {
            if (!lang) return code;

            return hljs.highlight(code, { language: lang }).value;
        },
    });

    fs.mkdirSync(root.replace(/^docs/, "typedoc-out/docs"), {
        recursive: true,
    });

    const relroot = "../".repeat(ftoken.length - 1);

    const data = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Cocoa Discord Utils Guide</title>
        <meta name="description" content="Guide for Cocoa Discord Utils" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/github-dark.min.css" 
            integrity="sha512-rO+olRTkcf304DQBxSWxln8JXCzTHlKnIdnMUwYvQa9/Jd4cQaNkItIUj6Z4nvW1dqK0SKXLbn9h4KwZTNtAyw==" 
            crossorigin="anonymous" referrerpolicy="no-referrer" 
        />
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.5.x/dist/typography.min.css"
        />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Inter"
        />
    </head>
    <body>
        <article class="prose prose-lg sm:prose-xl lg:prose-2xl">
            <a href="${relroot}docs/index.html">Guide Index</a>
            <a href="${relroot}index.html">TypeDoc Index</a>
            ${
                //@ts-ignore
                html.replaceAll(/<a\shref="[^\"]*">/g, (atag) =>
                    convertLink(atag, file)
                )
            }
        </article>
    </body>
    <style>
        body {
            font-family: "Inter";
            width: 100vw;
            background-color: #f4e1d4;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        h1 {
            font-weight: 900 !important;
        }

        li::marker {
            content: "";
        }

        article {
            margin: 0 auto;
            padding: 2rem;
            width: 100vw;
            background-color: white;
            min-height: 100vh;
        }

        @media (min-width: 1024px) {
            article {
                width: 66vw;
            }
        }

        @media (min-width: 1536px) {
            article {
                width: 50vw;
            }
        }
    </style>
</html>`;

    fs.writeFileSync(
        file.replace(".md", ".html").replace("docs/", "typedoc-out/docs/"),
        data
    );

    console.log(chalk.green(`Done with ${file}, ${data.length} bytes`));
}

const files = globby.sync("docs/**/*.md");
console.log(chalk.cyan(`Working on ${files.length} files: ${files}`));
files.map((f) => workOn(f));

fs.writeFileSync(
    "typedoc-out/docs.html",
    `
<html>
<body>
    <script>
        window.location = window.location.href.replace(/docs.html$/, "docs/index.html");
    </script>
</body>
</html>`
);

console.log(chalk.green("Done with typedoc-out/docs.html"));
