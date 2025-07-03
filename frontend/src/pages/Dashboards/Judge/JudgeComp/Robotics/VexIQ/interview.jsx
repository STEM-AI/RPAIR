

// Interview.jsx
import GenericRubric from "../../../../../../components/IntervIQNotbookIQInspection/IntervIQNotbook";
import {interviewCategories} from "../../../../../../components/IntervIQNotbookIQInspection/interviewCategories";
import InterviewRankings from "../../../../../../components/IntervIQNotbookIQInspection/InterviewRankings";
import { useSearchParams } from "react-router-dom";
const Interview = () => {
   const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const event_id = searchParams.get('eventId');
  
  return (
    <>
      <GenericRubric
        categories={interviewCategories}
        rubricTitle="Team Interview Rubric"
        pdfFileName="Interview_Rubric"
        maxTotalScore={45}
        apiScoreField="interview_score"
      />
      <InterviewRankings
        apiUrl={`${process.env.REACT_APP_API_URL}/event/${event_id}/teams-interview-rank/`}
      />
    </>
  );
}
export default Interview;