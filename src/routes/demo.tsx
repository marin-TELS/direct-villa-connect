import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { URL_DEMONSTRATION } from "../lib/constantes";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Démonstration" },
      {
        name: "description",
        content: "Redirection vers l’espace de gestion de démonstration.",
      },
      { property: "og:title", content: "Démonstration" },
      {
        property: "og:description",
        content: "Redirection vers l’espace de gestion de démonstration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PageDemo,
});

function PageDemo() {
  useEffect(() => {
    window.location.replace(URL_DEMONSTRATION);
  }, []);

  return null;
}
