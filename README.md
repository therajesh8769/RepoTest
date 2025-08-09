# AI-Powered GitHub Test Case Generator

A full-stack application that uses AI to automatically generate test cases for your GitHub repositories and creates pull requests with the generated tests.

## 🚀 Features

- **GitHub Integration**: OAuth authentication and repository access
- **AI-Powered**: Uses OpenAI GPT-4 to analyze code and generate intelligent test cases
- **Smart Analysis**: Analyzes multiple files and suggests comprehensive test scenarios
- **Test Generation**: Creates complete, runnable test code with proper imports and assertions
- **Pull Request Automation**: Automatically creates PRs with generated tests
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

```
test-case-generator/
├── backend/          # Node.js + Express API server
├── frontend/         # React + TailwindCSS client
└── README.md
```

### Backend (Node.js + Express)
- **Authentication**: GitHub OAuth integration
- **GitHub API**: Repository browsing and file management
- **OpenAI Integration**: GPT-4 powered test generation
- **Pull Request Creation**: Automated PR generation

### Frontend (React + TailwindCSS)
- **Authentication Flow**: GitHub OAuth
- **Repository Browser**: Select repos, branches, and files
- **Test Summary Display**: AI-generated test suggestions
- **Code Preview**: Syntax-highlighted test code
- **PR Management**: Create pull requests directly

## 📋 Prerequisites

- Node.js 18+ and npm
- GitHub account and OAuth app
- OpenAI API key

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd test-case-generator
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Set up GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Test Case Generator
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/auth/callback`
3. Note the Client ID and Client Secret

### 4. Configure Backend Environment

Create `backend/.env`:
```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/callback

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 5. Configure Frontend Environment

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=GitHub Test Case Generator
```

### 6. Start the development servers

```bash
# Start both backend and frontend
npm run dev

# Or start separately:
# Backend (http://localhost:5000)
cd backend && npm run dev

# Frontend (http://localhost:5173)
cd frontend && npm run dev
```

## 🔄 How It Works

1. **Authentication**: Login with your GitHub account
2. **Repository Selection**: Choose a repository and branch to analyze
3. **File Selection**: Select multiple code files using checkboxes
4. **AI Analysis**: Backend fetches file contents and sends to OpenAI GPT-4
5. **Test Summaries**: AI generates summaries of potential test cases
6. **Test Selection**: Choose a test summary to generate code for
7. **Code Generation**: AI creates complete test code with proper syntax
8. **Code Preview**: Review the generated test code
9. **Pull Request**: Create a PR with the test file in the `tests/` folder

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/github/url` - Get GitHub OAuth URL
- `POST /api/auth/github/exchange` - Exchange code for access token

### GitHub Integration
- `GET /api/github/repositories` - List user repositories
- `GET /api/github/repositories/:owner/:repo/branches` - List branches
- `GET /api/github/repositories/:owner/:repo/contents` - List files
- `POST /api/github/repositories/:owner/:repo/files/content` - Get file contents
- `POST /api/github/repositories/:owner/:repo/pull-request` - Create PR

### AI Services
- `POST /api/ai/test-summaries` - Generate test case summaries
- `POST /api/ai/test-code` - Generate test code from summary

## 🛡️ Security Features

- Rate limiting on all endpoints
- Token validation middleware
- Input sanitization and validation
- CORS protection
- Environment variable security

## 🧪 Supported Languages

The AI can generate tests for:
- JavaScript/TypeScript (Jest)
- Python (pytest)
- Java (JUnit)
- Go
- C/C++
- C#
- Ruby
- PHP

## 🚀 Production Deployment

### Backend
1. Set up a production database if needed
2. Configure production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update OAuth app URLs for production

## 🐛 Troubleshooting

### Common Issues

1. **OAuth Login Fails**: Verify GitHub OAuth app settings and redirect URL
2. **API Timeout**: Increase request timeout for large files
3. **AI Generation Fails**: Check OpenAI API key and rate limits
4. **PR Creation Fails**: Ensure proper GitHub token permissions

### Development Tips

- Use `npm run dev` to start both servers simultaneously
- Check browser developer tools for frontend errors
- Monitor backend logs for API issues
- Test with small files first before processing large codebases

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📧 Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information