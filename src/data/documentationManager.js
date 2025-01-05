// documentationManager.js
const fs = require('fs');
const path = require('path');

const faqDataPath = path.join(__dirname, 'faqData.js');
const knowledgeBasePath = path.join(__dirname, 'knowledgeBase.js');

/**
 * Adds a new Q&A entry to either faqData or knowledgeBase by physically modifying the .js file.
 * @param {string} question - The question text
 * @param {string} answer - The answer text
 * @param {boolean} toKnowledgeBase - If true, write to knowledgeBase.js; otherwise FAQ
 */
async function addDocumentationEntry(question, answer, toKnowledgeBase = true) {
    if (!question || !answer) {
        return {
            success: false,
            message: 'Question and answer cannot be empty.'
        };
    }

    // Decide which file to write to
    const targetFile = toKnowledgeBase ? knowledgeBasePath : faqDataPath;
    let fileContents = fs.readFileSync(targetFile, 'utf8');

    // We assume a basic structure like:
    // export const knowledgeBase = [
    //   { question: "...", answer: "..." },
    //   ...
    // ];
    // So we try to find the last "]" and insert before it.

    const arrayName = toKnowledgeBase ? 'knowledgeBase' : 'faqData';

    // Let’s find the array's last closing bracket: '];'
    // We do a naive approach. For production, you might do more robust parsing.
    const closeIndex = fileContents.lastIndexOf('];');
    if (closeIndex === -1) {
        throw new Error(
            `Could not find the array definition in ${targetFile}. Make sure it exports an array named ${arrayName}.`
        );
    }

    // Build a new item string. We need to add a comma if not the only item
    // We'll create a well-formed object with escaped quotes for question & answer
    const newEntry = `,\n  {\n    question: ${JSON.stringify(question)},\n    answer: ${JSON.stringify(answer)}\n  }`;

    // Insert before the last bracket
    const updatedContents =
        fileContents.slice(0, closeIndex) + newEntry + fileContents.slice(closeIndex);

    // Write file back
    fs.writeFileSync(targetFile, updatedContents, 'utf8');

    return {
        success: true,
        message: `Successfully added to ${toKnowledgeBase ? 'knowledgeBase' : 'faqData'}.`
    };
}

module.exports = {
    addDocumentationEntry
};
