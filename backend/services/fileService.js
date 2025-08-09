const path = require('path');
const logger = require('../utils/logger');

class FileService {
  validateFiles(files) {
    if (!Array.isArray(files)) {
      throw new Error('Files must be an array');
    }
    
    if (files.length === 0) {
      throw new Error('At least one file must be selected');
    }
    
    if (files.length > 10) {
      throw new Error('Maximum 10 files can be processed at once');
    }
    
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (totalSize > maxSize) {
      throw new Error('Total file size exceeds 5MB limit');
    }
    
    return true;
  }
  
  sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
  
  getFileLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.jsx': 'React JSX',
      '.tsx': 'React TSX',
      '.py': 'Python',
      '.java': 'Java',
      '.go': 'Go',
      '.cpp': 'C++',
      '.c': 'C',
      '.cs': 'C#',
      '.rb': 'Ruby',
      '.php': 'PHP'
    };
    
    return languageMap[ext] || 'Unknown';
  }
  
  isTestFile(filePath) {
    const testPatterns = [
      /\.test\./,
      /\.spec\./,
      /_test\./,
      /test_.*\.py$/,
      /.*Test\.java$/
    ];
    
    return testPatterns.some(pattern => pattern.test(filePath));
  }
  
  filterCodeFiles(files) {
    const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.cpp', '.c', '.cs', '.rb', '.php'];
    
    return files.filter(file => {
      const ext = path.extname(file.name || file.path).toLowerCase();
      return codeExtensions.includes(ext) && !this.isTestFile(file.name || file.path);
    });
  }
}

module.exports = FileService;