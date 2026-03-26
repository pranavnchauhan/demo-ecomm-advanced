import { NextResponse } from "next/server"
import {
  createRedirectList,
  addRedirectItems,
  getRedirectList,
  deleteRedirectItems,
  fetchExistingSitemap,
  createBulkRedirectRule,
} from "@/lib/cloudflare"

// Get current redirect list items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const listId = searchParams.get("listId")

    if (!listId) {
      return NextResponse.json(
        { error: "listId query param required" },
        { status: 400 }
      )
    }

    const result = await getRedirectList(listId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Cloudflare redirects fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch redirects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      // Create a new redirect list
      case "createList": {
        const result = await createRedirectList(
          data.name || "saltstone-seo-migration",
          data.description
        )
        return NextResponse.json(result)
      }

      // Add redirect items to a list
      case "addRedirects": {
        const result = await addRedirectItems(data.listId, data.redirects)
        return NextResponse.json(result)
      }

      // Remove redirect items from a list
      case "deleteRedirects": {
        const result = await deleteRedirectItems(data.listId, data.itemIds)
        return NextResponse.json(result)
      }

      // Create the bulk redirect rule that activates the list
      case "activateList": {
        const result = await createBulkRedirectRule(
          data.listId,
          data.ruleName || "Salt & Stone SEO Migration Redirects"
        )
        return NextResponse.json(result)
      }

      // Auto-generate redirects from old sitemap
      case "generateFromSitemap": {
        const oldUrls = await fetchExistingSitemap(data.sitemapUrl)

        if (oldUrls.length === 0) {
          return NextResponse.json({
            error: "No URLs found in sitemap",
            sitemapUrl: data.sitemapUrl,
          })
        }

        // Map old URLs to new URL structure
        const urlMapping = data.urlMapping as Record<string, string> || {}
        const domain = data.newDomain || ""

        const redirects = oldUrls
          .map((oldUrl) => {
            const path = new URL(oldUrl).pathname

            // Check explicit mapping first
            if (urlMapping[path]) {
              return {
                source_url: oldUrl,
                target_url: `${domain}${urlMapping[path]}`,
                status_code: 301 as const,
              }
            }

            // Auto-mapping rules for common patterns
            if (path.startsWith("/product/")) {
              return {
                source_url: oldUrl,
                target_url: `${domain}/products/${path.replace("/product/", "")}`,
                status_code: 301 as const,
              }
            }
            if (path.startsWith("/collection/")) {
              return {
                source_url: oldUrl,
                target_url: `${domain}/collections/${path.replace("/collection/", "")}`,
                status_code: 301 as const,
              }
            }

            return null
          })
          .filter(Boolean)

        return NextResponse.json({
          totalOldUrls: oldUrls.length,
          redirectsGenerated: redirects.length,
          redirects,
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("SEO redirects error:", error)
    return NextResponse.json(
      { error: "SEO redirects API failed" },
      { status: 500 }
    )
  }
}
