const formatSingleLineCode = (text) => {
  if (!text) return { question: "", code: "" };

  const questionEnd = text.indexOf("?");
  const question = text.substring(0, questionEnd + 1);
  let code = text.substring(questionEnd + 1).trim();

  code = code
    .replace(/^(\\n|;)+/, '')  
    .replace(/\\n/g, "\n")    
    .replace(/\\t/g, "    ") 
    // .replace(/;/g, ";\n")      
    .replace(/\n+/g, "\n");    

  return { question, code };
};

export default formatSingleLineCode;