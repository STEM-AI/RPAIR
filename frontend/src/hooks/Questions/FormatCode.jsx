const formatSingleLineCode = (text) => {
  if (!text) return { question: "", code: "" };

  const questionEnd = text.indexOf("?");
  const question = text.substring(0, questionEnd + 1);
  let code = text.substring(questionEnd + 1).trim();

  code = code
    .replace(/^(\\n|;)+/, '')   // Remove leading \n or ;
    .replace(/\\n/g, "\n")      // Replace literal \n with newline characters
    .replace(/\\t/g, "    ")    // Replace literal \t with 4 spaces
    .replace(/\n\s*/g, "\n")    // Remove any spaces after newlines
    .replace(/\n+/g, "\n");     // Collapse multiple newlines

  return { question, code };
};

export default formatSingleLineCode;