

import NotBookRankings from "../../../../../../components/IntervIQNotbookIQInspection/NotBookRankings";
import GenericRubric from "../../../../../../components/IntervIQNotbookIQInspection/IntervIQNotbook";
import {notebookCategories} from "../../../../../../components/IntervIQNotbookIQInspection/notebookCategories";
import { useEventNameContext } from "../../../../../../context/EventName";

const Notebook = () => {
  const { currentCompetition } = useEventNameContext();
    
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
        apiUrl={`${process.env.REACT_APP_API_URL}/event/${currentCompetition}/teams-eng-notebook-rank/`}
      />
    </>
);
}

export default Notebook;