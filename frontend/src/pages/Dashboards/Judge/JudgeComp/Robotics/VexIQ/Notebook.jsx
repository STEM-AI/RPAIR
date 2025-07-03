

import NotBookRankings from "../../../../../../components/IntervIQNotbookIQInspection/NotBookRankings";
import GenericRubric from "../../../../../../components/IntervIQNotbookIQInspection/IntervIQNotbook";
import {notebookCategories} from "../../../../../../components/IntervIQNotbookIQInspection/notebookCategories";
import { useSearchParams } from "react-router-dom";

const Notebook = () => {
    const [searchParams] = useSearchParams();
    const event_name = searchParams.get('eventName');
    const event_id= searchParams.get('eventId');
    
    return (
      <>
  <GenericRubric
    categories={notebookCategories}
    rubricTitle="Engineering Notebook Rubric"
    pdfFileName="Notebook_Rubric"
    maxTotalScore={45}
    apiScoreField="eng_notebook_score"
        />
        <NotBookRankings
        apiUrl={`${process.env.REACT_APP_API_URL}/event/${event_id}/teams-eng-notebook-rank/`}
      />
    </>
);
}

export default Notebook;