// const { openai, openaiConfig } = require('../config/openai');
// const logger = require('../utils/logger');

// class AIService {
//   async generateTestSummaries(files) {
//     try {
//       const fileContents = files.map(file => 
//         `File: ${file.path}\n\`\`\`${this.getFileExtension(file.path)}\n${file.content}\n\`\`\``
//       ).join('\n\n');

//       const prompt = `
// Analyze the following code files and generate test case summaries. For each file, provide 2-3 potential test scenarios that should be covered. 

// Return your response as a JSON array where each object has:
// - "file": the file path
// - "testSummaries": array of objects with "title" and "description" fields

// Code files:
// ${fileContents}

// Focus on:
// 1. Unit tests for individual functions/methods
// 2. Integration tests for component interactions  
// 3. Edge cases and error handling
// 4. Input validation tests

// Respond only with valid JSON.
//       `;

//       const response = await openai.chat.completions.create({
//         model: openaiConfig.model,
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: openaiConfig.maxTokens,
//         temperature: openaiConfig.temperature
//       });

//       const content = response.choices[0].message.content.trim();
//       return JSON.parse(content);
//     } catch (error) {
//       logger.error('Failed to generate test summaries', { error: error.message });
//       throw new Error('Failed to generate test summaries');
//     }
//   }

//   async generateTestCode(file, testSummary) {
//     try {
//       const prompt = `
// Generate complete test code for the following scenario:

// File: ${file.path}
// Test Title: ${testSummary.title}  
// Test Description: ${testSummary.description}

// Source Code:
// \`\`\`${this.getFileExtension(file.path)}
// ${file.content}
// \`\`\`

// Requirements:
// 1. Generate complete, runnable test code
// 2. Use appropriate testing framework (Jest for JS/TS, pytest for Python, JUnit for Java, etc.)
// 3. Include necessary imports and setup
// 4. Add descriptive test names and comments
// 5. Cover both positive and negative test cases
// 6. Include proper assertions and error handling

// Return only the test code, properly formatted with syntax highlighting.
//       `;

//       const response = await openai.chat.completions.create({
//         model: openaiConfig.model,
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: openaiConfig.maxTokens,
//         temperature: openaiConfig.temperature
//       });

//       return response.choices[0].message.content.trim();
//     } catch (error) {
//       logger.error('Failed to generate test code', { error: error.message });
//       throw new Error('Failed to generate test code');
//     }
//   }

//   getFileExtension(filePath) {
//     const ext = filePath.split('.').pop().toLowerCase();
//     const extensionMap = {
//       'js': 'javascript',
//       'ts': 'typescript', 
//       'jsx': 'jsx',
//       'tsx': 'tsx',
//       'py': 'python',
//       'java': 'java',
//       'go': 'go',
//       'cpp': 'cpp',
//       'c': 'c',
//       'cs': 'csharp',
//       'rb': 'ruby',
//       'php': 'php'
//     };
//     return extensionMap[ext] || ext;
//   }

//   generateTestFileName(originalFilePath, testSummary) {
//     const pathParts = originalFilePath.split('/');
//     const fileName = pathParts[pathParts.length - 1];
//     const nameWithoutExt = fileName.split('.')[0];
//     const extension = fileName.split('.').pop();
    
//     const sanitizedTitle = testSummary.title
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, '-')
//       .replace(/-+/g, '-')
//       .replace(/^-|-$/g, '');
    
//     return `tests/${nameWithoutExt}-${sanitizedTitle}.test.${extension}`;
//   }
// }

// module.exports = AIService;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { geminiConfig } = require('../config/gemini');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    if (!geminiConfig.apiKey) {
      throw new Error("GEMINI_API_KEY not set in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: geminiConfig.model });
  }

  async generateTestSummaries(files) {
    try {
      const fileContents = files.map(file =>
        `File: ${file.path}\n\`\`\`${this.getFileExtension(file.path)}\n${file.content}\n\`\`\``
      ).join('\n\n');
  
      const prompt = `
  Analyze the following code files and generate test case summaries.
  Respond ONLY with a JSON array like:
  [
    { "title": "Test case title", "description": "Test case description" }
  ]
  Do not include any extra text or explanation.
  ${fileContents}
      `;
  
      const result = await this.model.generateContent(prompt);
      const rawText = (result?.response?.text && result.response.text()) 
        ? result.response.text().trim()
        : (typeof result === 'string' ? result.trim() : JSON.stringify(result));
  
      logger.info("Gemini raw output (summaries):", rawText);
  
      // Try strict parse first
      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed)) return parsed;
        // If it's an object that contains the JSON we need (rare), try to extract
        if (parsed && typeof parsed === 'object') {
          // If model returned { code: "..."} or { testSummaries: [...] }
          if (Array.isArray(parsed.testSummaries)) return parsed.testSummaries;
          if (Array.isArray(parsed.candidates)) {
            // handle cases where entire API wrapper was returned as text
            const inner = parsed.candidates[0]?.content?.parts?.[0]?.text;
            if (inner) {
              try {
                const innerParsed = JSON.parse(inner);
                if (Array.isArray(innerParsed)) return innerParsed;
              } catch {}
            }
          }
        }
      } catch (e) {
        // not valid JSON - try to find embedded JSON inside text (like ```json ...```)
        const jsonMatch = rawText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) {
          try {
            const maybe = JSON.parse(jsonMatch[0]);
            if (Array.isArray(maybe)) return maybe;
          } catch {}
        }
      }
  
      // Fallback: wrap the raw text into a single summary so frontend can always map
      return [
        {
          title: "AI output (raw)",
          description: typeof rawText === 'string' ? rawText : JSON.stringify(rawText)
        }
      ];
    } catch (error) {
      logger.error('Failed to generate test summaries', { error: error.message });
      throw new Error('Failed to generate test summaries');
    }
  }
  






  async generateTestCode(file, testSummary) {
    try {
      const prompt = `
  Generate complete test code for the following scenario.
  Return ONLY valid JSON: { "code": "<full test code string>" }
  Title: ${testSummary.title}
  Description: ${testSummary.description}
  Source:
  \`\`\`${this.getFileExtension(file.path)}
  ${file.content}
  \`\`\`
      `;
  
      const result = await this.model.generateContent(prompt);
      const rawText = (result?.response?.text && result.response.text()) 
        ? result.response.text().trim()
        : (typeof result === 'string' ? result.trim() : JSON.stringify(result));
  
      logger.info("Gemini raw output (test code):", rawText);
  
      try {
        const parsed = JSON.parse(rawText);
        if (parsed && parsed.code) return parsed.code;
      } catch {}
  
      // try to find JSON block inside raw text
      const jsonMatch = rawText.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && parsed.code) return parsed.code;
        } catch {}
      }
  
      // fallback: return raw text (so frontend can show it)
      return rawText;
    } catch (error) {
      logger.error('Failed to generate test code', { error: error.message });
      throw new Error('Failed to generate test code');
    }
  }
  

  getFileExtension(filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    const extensionMap = {
      'js': 'javascript', 'ts': 'typescript',
      'jsx': 'jsx', 'tsx': 'tsx',
      'py': 'python', 'java': 'java',
      'go': 'go', 'cpp': 'cpp',
      'c': 'c', 'cs': 'csharp',
      'rb': 'ruby', 'php': 'php'
    };
    return extensionMap[ext] || ext;
  }

  generateTestFileName(originalFilePath, testSummary) {
    const fileName = originalFilePath.split('/').pop();
    const nameWithoutExt = fileName.split('.')[0];
    const extension = fileName.split('.').pop();

    const sanitizedTitle = testSummary.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `tests/${nameWithoutExt}-${sanitizedTitle}.test.${extension}`;
  }
}

module.exports = AIService;
