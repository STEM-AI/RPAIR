const formatSingleLineCode = (text) => {
  if (!text) return { question: '', code: '' };

  // فصل السؤال عن الكود
  const questionEnd = text.indexOf('?');
  const question = text.substring(0, questionEnd + 1);
  let code = text.substring(questionEnd + 1).trim();

  code = code
    .replace(/;\s*/g, ';\n')
    .replace(/^;\n/, '')

    .replace(/\b(if|elif|else|for|while|def|class|try|except|with)\b\s*.*:\s*([^\n]+)/g,
      (match, keyword, afterColon) => {
        return match.replace(/:\s*([^\n]+)/, ':\n    $1'); 
      }
    )

    .replace(/:\s*\n([\s\S]*?)(?=^\s*return)/gm, (match, block) => {
      let lines = block.split('\n').map(line => {
        if (!line.trim()) return line; 
        return '    ' + line; // 
      });

      let returnCount = 0;
      lines = lines.map(line => {
        if (/^\s*return\b/.test(line)) {
          returnCount++;
          if (returnCount > 1) {
            return line.slice(2); 
          }
        }
        return line;
      });

      return ':\n' + lines.join('\n');
    })

    
    .replace(/^\s*(return)/gm, '$1')
    .replace(/\breturn\s+/g, 'return ')
    .replace(/\bif\s+/g, 'if ')
    .replace(/\bdef\s+/g, 'def ');

  return { question, code };
};

export default formatSingleLineCode;