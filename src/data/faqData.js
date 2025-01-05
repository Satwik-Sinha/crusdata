// src/data/faqData.js
export const faqData = [
    {
        question: "How do I search for people?",
        answer: `Use the /screener/person/search endpoint with this structure:

\`\`\`bash
curl --location 'https://api.crustdata.com/screener/person/search' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Token QUlMIFlPVVIgQkFTRSBBUkUgQkVMT05HIFRPIFVT' \\
--data '{
  "filters": [
    {
      "filter_type": "CURRENT_COMPANY",
      "type": "in",
      "value": ["openai.com"]
    },
    {
      "filter_type": "CURRENT_TITLE",
      "type": "in",
      "value": ["engineer"]
    },
    {
      "filter_type": "REGION",
      "type": "in",
      "value": ["United States"]
    }
  ],
  "page": 1
}'
\`\`\`
`
    },
    {
        question: "What regions are supported in the API?",
        answer:
            "The API requires specific region values from our standardized list. You can find all supported regions at: https://crustdata-docs-region-ison.s3.us-east-2.amazonaws.com/updated_regions.json"
    }
];
