# Test Case Generator Frontend

React frontend for the AI-powered GitHub test case generator.

## Features

- GitHub OAuth authentication
- Repository and branch selection
- File browsing with multi-select
- AI-generated test case summaries
- Test code generation and preview
- Pull request creation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will run on http://localhost:5173

## Architecture

- **Pages**: Main application routes and views
- **Components**: Reusable UI components
- **Services**: API communication layer
- **Contexts**: Global state management
- **Styles**: Tailwind CSS configuration

## User Flow

1. **Login** - GitHub OAuth authentication
2. **Repository Selection** - Choose repo and branch
3. **File Selection** - Select code files to test
4. **Test Summaries** - View AI-generated test suggestions
5. **Test Generator** - Generate and preview test code
6. **Pull Request** - Create PR with generated tests