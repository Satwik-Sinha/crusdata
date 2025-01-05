// src/data/knowledgeBase.js

/**
 * Additional knowledge base for advanced or Slack-like Q&A
 * This is our "Level 2" ingestion data.
 * We'll allow real-time additions via "documentationManager".
 */
export const knowledgeBase = [
    {
        question: "How do I search for people given their current title, current company and location?",
        answer: `Use https://api.crustdata.com/screener/person/search with filters for CURRENT_COMPANY, CURRENT_TITLE, and REGION. 
Remember to specify a valid region from the official region list.`
    },
    {
        question: "Is there a standard list of region values? I'm getting a 422 from screener/person/search.",
        answer: `Yes, there's a strict set of region values. 
See: https://crustdata-docs-region-ison.s3.us-east-2.amazonaws.com/updated_regions.json
If the region doesn't match exactly, you get a 422 error.`
    },
    {
        question: "I tried search/enrichment by email but for many entities we have gmails. The results are incomplete. Why?",
        answer: `Crustdata's People Enrichment relies on business emails for best results. 
Personal addresses (like Gmail) might return incomplete data. 
Try an alternate approach by passing a LinkedIn URL or searching by name/title/company.`
    }
 ];
