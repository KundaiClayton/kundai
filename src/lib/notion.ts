// src/lib/notion.ts
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const NOTION_API_KEY = import.meta.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is not defined in environment variables');
}

if (!NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not defined in environment variables');
}

const notion = new Client({
  auth: NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllPublished = async () => {
  try {
    console.log('Fetching all published posts...');
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

    console.log('Raw posts response:', JSON.stringify(posts, null, 2));
    
    const allPosts = posts.results;
    const processedPosts = allPosts.map((post) => {
      console.log('Processing post with ID:', post.id);
      return getPageMetaData(post);
    });
    
    console.log('Processed posts:', JSON.stringify(processedPosts, null, 2));
    return processedPosts;
  } catch (error) {
    console.error('Error in getAllPublished:', error);
    throw error;
  }
};

// export const getSingleBlogPostBySlug = async (slug: string) => {
//   try {
//     console.log('Fetching post with slug:', slug);
//     const response = await notion.databases.query({
//       database_id: NOTION_DATABASE_ID,
//       filter: {
//         property: "Slug",
//         formula: {
//           string: {
//             equals: slug,
//           },
//         },
//       },
//     });

//     console.log('Response for slug:', JSON.stringify(response, null, 2));

//     const page = response.results[0];
//     if (!page) {
//       throw new Error(`No post found with slug: ${slug}`);
//     }

//     console.log('Found page with ID:', page.id);
//     const metadata = getPageMetaData(page);
//     console.log('Generated metadata:', metadata);
    
//     console.log('Fetching markdown for page ID:', page.id);
//     const mdblocks = await n2m.pageToMarkdown(page.id);
//     const mdString = n2m.toMarkdownString(mdblocks);
//     console.log('Generated markdown string length:', mdString.length);

//     return {
//       metadata,
//       markdown: mdString,
//     };
//   } catch (error) {
//     console.error('Error in getSingleBlogPostBySlug:', error);
//     throw error;
//   }
// };

const getPageMetaData = (post: any) => {
  try {
    console.log('Getting metadata for post:', post.id);
    console.log('Post properties:', JSON.stringify(post.properties, null, 2));
    
    const getTags = (tags: any[]) => {
      return tags.map((tag) => tag.name);
    };

    const metadata = {
      id: post.id,
      title: post.properties.Name.title[0].plain_text,
      tags: getTags(post.properties.Tags.multi_select),
      description: post.properties.Description.rich_text[0].plain_text,
      date: formatDate(post.properties.Date.date.start),
      slug: post.properties.Slug.rich_text[0].plain_text,
    };

    console.log('Generated metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error in getPageMetaData:', error);
    console.error('Post object:', JSON.stringify(post, null, 2));
    throw error;
  }
};

function formatDate(datestring?: string) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const date = datestring ? new Date(datestring) : new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

// src/lib/notion.ts

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
  
      // Debug log
      console.log('Markdown string:', mdString);
      console.log('Markdown parent:', mdString.parent);
  
      return {
        metadata,
        markdown: mdString.parent, // Make sure we're using .parent
      };
    } catch (error) {
      console.error('Error fetching single post:', error);
      throw error;
    }
  };