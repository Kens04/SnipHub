import type { SandpackFiles } from "@codesandbox/sandpack-react";

interface GetDefaultFilesProps {
  template: string;
  contentCode?: string;
}

export const getDefaultFiles = ({
  template,
  contentCode,
}: GetDefaultFilesProps): SandpackFiles => {
  switch (template) {
    case "react-ts":
      return {
        "/App.tsx": {
          code: `import Button from "./Button";\n\nexport default function App() {\n  return (\n    <div className="p-4">\n      <Button />\n    </div>\n  );\n}`,
        },
        "/Button.tsx": {
          code:
            contentCode ||
            `export default function Button() {\n  return <h1>Hello world</h1>;\n}`,
        },
      };

    case "react":
      return {
        "/App.js": {
          code: `import Button from "./Button";\n\nexport default function App() {\n  return (\n    <div className="p-4">\n      <Button />\n    </div>\n  );\n}`,
        },
        "/Button.js": {
          code:
            contentCode ||
            `export default function Button() {\n  return <h1>Hello world</h1>;\n}`,
        },
      };

    case "vanilla":
      return {
        "/index.js": {
          code:
            contentCode ||
            `document.getElementById("app").innerHTML = "<h1>Hello world</h1>";`,
        },
      };

    case "static":
      return {
        "/index.html": {
          code:
            contentCode ||
            `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello world</h1>\n  </body>\n</html>`,
        },
      };

    default:
      return {
        "/App.tsx": {
          code: `import Button from "./Button";\n\nexport default function App() {\n  return (\n    <div className="p-4">\n      <Button />\n    </div>\n  );\n}`,
        },
        "/Button.tsx": {
          code:
            contentCode ||
            `export default function Button() {\n  return <h1>Hello world</h1>;\n}`,
        },
      };
  }
};
