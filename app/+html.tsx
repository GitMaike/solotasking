import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * { box-sizing: border-box; }
            /* Remove overlays que bloqueiam cliques */
            [data-focusable="true"] { pointer-events: auto !important; }
            div[style*="pointer-events: none"] { pointer-events: auto !important; }
            /* Garante que botões sempre clicáveis */
            button { pointer-events: auto !important; cursor: pointer; }
          `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
