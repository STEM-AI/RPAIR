// src/services/pdfService.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateRubricPDF = (categories, teamData, judge, specialNotes, totalScore, pdfFileName ,scores) => {
      const doc = new jsPDF();
  
    // Set Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Team Interview Rubric", 14, 15);
  
    // Team Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
   doc.text(`Team Name: ${teamData?.name || "N/A"}`, 14, 25);
  doc.text(`Grade Level: ${teamData?.grade_level || "N/A"}`, 100, 25);;
     doc.text(`Judge Name: ${judge || "N/A"}`, 14, 32);
     
  
    // Table Headers and Rows
    const tableColumn = [
      "Criteria",
      "Expert (4-5)",
      "Proficient (2-3)",
      "Emerging (0-1)",
      "Score"
    ];
    const tableRows = categories.map(({ title, options, category }) => {
    const score = scores[category] || "N/A"; // <-- استخدم المعامل الجديد
    return [
        title,
        options[0]?.message || "",
        options[1]?.message || "",
        options[2]?.message || "",
        score
      ];
    });
  
    // Generate Table with Red Headers
    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] }, // Red header with white text
      margin: { left: 14, right: 14 },
      theme: "grid",
    });
  
    // Get last Y position from the table
    let finalY = doc.lastAutoTable.finalY;
  
    // Special Features and Notes Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Special Features and General Impressions", 14, finalY + 8);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "Does the team have any special attributes, accomplishments, or exemplary effort in overcoming challenges?\n" +
      "Did anything stand out about this team in their interview? Please describe:",
      14, finalY + 15
    );
  
    // Notes and Total Score
    doc.setFont("helvetica");
    doc.setFontSize(11);
    doc.text(`Notes: ${specialNotes || "None"}`, 14, finalY + 25);
  doc.text(`Total Score: ${totalScore}`, 150, finalY + 40);
      doc.save(`${teamData?.name || "Unknown"}_${pdfFileName}.pdf`);
    };
