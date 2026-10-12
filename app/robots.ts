import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // Explicitly ALLOW AI Bots and Search Engines on public routes to be indexed and cited in answers
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "GoogleOther",
          "Applebot-Extended",
          "Meta-ExternalAgent",
          "cohere-ai",
          "CCBot"
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      }
    ],
    sitemap: "https://rentyourproperty.pk/sitemap.xml",
  };
}
