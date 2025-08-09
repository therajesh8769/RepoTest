# Test Case Generator Backend

Backend API for the AI-powered GitHub test case generator.

## Features

- GitHub OAuth authentication
- Repository and file browsing
- AI-powered test case generation using OpenAI GPT-4
- Pull request creation with generated tests
- Rate limiting and error handling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `GET /api/auth/github/url` - Get GitHub OAuth URL
- `POST /api/auth/github/exchange` - Exchange OAuth code for access token

### GitHub Integration
- `GET /api/github/repositories` - Get user repositories
- `GET /api/github/repositories/:owner/:repo/branches` - Get repository branches
- `GET /api/github/repositories/:owner/:repo/contents` - Get repository files
- `POST /api/github/repositories/:owner/:repo/files/content` - Get multiple file contents
- `POST /api/github/repositories/:owner/:repo/pull-request` - Create pull request

### AI Services  
- `POST /api/ai/test-summaries` - Generate test case summaries
- `POST /api/ai/test-code` - Generate test code from summary

## Architecture

- **Routes**: Handle HTTP requests and responses
- **Services**: Business logic for GitHub, AI, and file operations
- **Utils**: Authentication middleware and logging
- **Config**: Configuration for external services