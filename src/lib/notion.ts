import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const NOTION_API_KEY = import.meta.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined in environment variables");
}

if (!NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID is not defined in environment variables");
}

const notion = new Client({
  auth: NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Get all published content from Notion
export const getAllPublished = async () => {
  try {
    console.log("Fetching all published posts...");
    const posts = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const allPosts = posts.results;
    const processedPosts = allPosts.map((post) => {
      return getPageMetaData(post);
    });

    return processedPosts;
  } catch (error) {
    console.error("Error in getAllPublished:", error);
    throw error;
  }
};

// Get content by specific type (Essay, Note, Project, etc.)
export const getContentByType = async (contentType: string) => {
  try {
    console.log(`Fetching published ${contentType} content...`);
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Content Type",
            select: {
              equals: contentType,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const content = response.results;
    return content.map((item) => getPageMetaData(item));
  } catch (error) {
    console.error(`Error fetching ${contentType} content:`, error);
    throw error;
  }
};

// Get featured content (for Essays, Projects, etc.)
export const getFeaturedContent = async (contentType: string) => {
  try {
    console.log(`Fetching featured ${contentType} content...`);
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Content Type",
            select: {
              equals: contentType,
            },
          },
          {
            property: "Featured",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const content = response.results;
    return content.map((item) => getPageMetaData(item));
  } catch (error) {
    console.error(`Error fetching featured ${contentType} content:`, error);
    throw error;
  }
};

// Get recent content (limit by count)
export const getRecentContent = async (
  contentType: string,
  count: number = 3
) => {
  try {
    console.log(`Fetching recent ${contentType} content...`);
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Content Type",
            select: {
              equals: contentType,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
      page_size: count,
    });

    const content = response.results;
    return content.map((item) => getPageMetaData(item));
  } catch (error) {
    console.error(`Error fetching recent ${contentType} content:`, error);
    throw error;
  }
};

// Get content by tag
export const getContentByTag = async (tag: string) => {
  try {
    console.log(`Fetching content with tag: ${tag}...`);
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Tags",
            multi_select: {
              contains: tag,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const content = response.results;
    return content.map((item) => getPageMetaData(item));
  } catch (error) {
    console.error(`Error fetching content with tag ${tag}:`, error);
    throw error;
  }
};

// Get related content (by matching tags)
export const getRelatedContent = async (
  currentPostId: string,
  tags: string[],
  limit: number = 3
) => {
  try {
    console.log(`Fetching related content for tags: ${tags.join(", ")}...`);

    if (tags.length === 0) {
      return [];
    }

    // Create a filter for each tag
    const tagFilters = tags.map((tag) => ({
      property: "Tags",
      multi_select: {
        contains: tag,
      },
    }));

    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            or: tagFilters,
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    // Filter out the current post and limit the results
    const relatedContent = response.results
      .filter((item) => item.id !== currentPostId)
      .slice(0, limit);

    return relatedContent.map((item) => getPageMetaData(item));
  } catch (error) {
    console.error("Error fetching related content:", error);
    throw error;
  }
};

// Get a single post by its slug
export const getSingleBlogPostBySlug = async (slug: string) => {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: "Slug",
        formula: {
          string: {
            equals: slug,
          },
        },
      },
    });

    const page = response.results[0];
    if (!page) {
      throw new Error(`No post found with slug: ${slug}`);
    }

    const metadata = getPageMetaData(page);
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    // Get related content based on tags
    const relatedContent = await getRelatedContent(page.id, metadata.tags);

    return {
      metadata,
      markdown: mdString.parent,
      relatedContent,
    };
  } catch (error) {
    console.error("Error fetching single post:", error);
    throw error;
  }
};

// Extract metadata from a Notion page
const getPageMetaData = (post: any) => {
  try {
    console.log("Getting metadata for post:", post.id);

    // Debug: Log all property names to identify the correct one for cover images
    console.log("Available properties:", Object.keys(post.properties));

    // Function to extract tags from multi-select property
    const getTags = (tags: any[]) => {
      return tags.map((tag) => tag.name);
    };

    // Handle cover image if it exists
    // Check multiple possible property names for cover images
    let coverImage = null;
    const possibleImagePropertyNames = [
      "Files & media",
      "Cover",
      "Image",
      "Cover Image",
      "Featured Image",
    ];

    for (const propName of possibleImagePropertyNames) {
      if (
        post.properties[propName] &&
        post.properties[propName].files &&
        post.properties[propName].files.length > 0
      ) {
        const file = post.properties[propName].files[0];
        console.log(`Found image in property "${propName}":`, file);
        coverImage = file.file ? file.file.url : file.external?.url;
        if (coverImage) break;
      }
    }

    // Also check for page cover if it exists
    if (!coverImage && post.cover) {
      console.log("Found page cover:", post.cover);
      if (post.cover.type === "external") {
        coverImage = post.cover.external.url;
      } else if (post.cover.type === "file") {
        coverImage = post.cover.file.url;
      }
    }

    // Extract content type - default to "Article" if not found
    let contentType = "Article";
    if (
      post.properties["Content Type"] &&
      post.properties["Content Type"].select
    ) {
      contentType = post.properties["Content Type"].select.name;
    }

    // Check for featured status
    let featured = false;
    if (post.properties["Featured"] && post.properties["Featured"].checkbox) {
      featured = post.properties["Featured"].checkbox;
    }

    // Check for status (complete or WIP)
    let status = "complete";
    if (post.properties["Status"] && post.properties["Status"].select) {
      status = post.properties["Status"].select.name.toLowerCase();
    }

    // Extract external links
    let externalLinks = [];

    // If using a URL field
    if (
      post.properties["External Link"] &&
      post.properties["External Link"].url
    ) {
      externalLinks.push({
        title: "View Project", // Default title
        url: post.properties["External Link"].url,
      });
    }

    // If using a Rich Text field with multiple links
    if (
      post.properties["External Links"] &&
      post.properties["External Links"].rich_text &&
      post.properties["External Links"].rich_text.length > 0
    ) {
      for (const textBlock of post.properties["External Links"].rich_text) {
        if (textBlock.href) {
          externalLinks.push({
            title: textBlock.plain_text || "Link",
            url: textBlock.href,
          });
        }
      }
    }

    // Create the metadata object with safe fallbacks
    const metadata = {
      id: post.id,
      title: post.properties.Name?.title[0]?.plain_text || "Untitled",
      tags: post.properties.Tags?.multi_select
        ? getTags(post.properties.Tags.multi_select)
        : [],
      description: post.properties.Description?.rich_text[0]?.plain_text || "",
      date: formatDate(post.properties.Date?.date?.start),
      slug: post.properties.Slug?.rich_text[0]?.plain_text || "",
      coverImage: coverImage,
      contentType: contentType,
      featured: featured,
      status: status,
      externalLinks: externalLinks,
    };

    console.log("Generated metadata with coverImage:", metadata.coverImage);
    return metadata;
  } catch (error) {
    console.error("Error in getPageMetaData:", error);
    console.error("Post object:", JSON.stringify(post, null, 2));
    throw error;
  }
};

// Format a date string
function formatDate(datestring?: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = datestring ? new Date(datestring) : new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

// Get all unique tags from the database
export const getAllTags = async () => {
  try {
    console.log("Fetching all tags...");
    const posts = await getAllPublished();

    // Extract all tags and remove duplicates
    const tags = [...new Set(posts.flatMap((post) => post.tags))];

    // Sort alphabetically
    return tags.sort();
  } catch (error) {
    console.error("Error fetching all tags:", error);
    throw error;
  }
};

// Search content by query string (searches title and description)
export const searchContent = async (query: string) => {
  try {
    console.log(`Searching for content matching: ${query}`);
    // First get all published content (Notion API doesn't have text search)
    const allContent = await getAllPublished();

    // Perform case-insensitive search on title and description
    const lowerCaseQuery = query.toLowerCase();
    const results = allContent.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
    );

    return results;
  } catch (error) {
    console.error("Error searching content:", error);
    throw error;
  }
};
