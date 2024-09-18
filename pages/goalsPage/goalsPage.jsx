import "./GoalsPage.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGoalDetailsApi } from "../../utils/apiUtils";
import Loader from "../../components/Loader/Loader";
import PageHeaderEdit from "../../components/PageHeaderEdit/PageHeaderEdit";

export default function GoalsPage() {
  const [goalDetails, setGoalDetails] = useState(null);
  const { id } = useParams(); // For fetching specific goal by ID

  const getGoalDetails = async () => {
    try {
      const details = await getGoalDetailsApi(id);
      setGoalDetails(details);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGoalDetails();
  }, [id]);

  if (!goalDetails) {
    return <Loader loading="true" />;
  }

  return (
    <>
      <PageHeaderEdit
        linkRoute="/goals"
        pageTitle={goalDetails.name}
        editLinkRoute={`/goals/${id}/edit`}
      />
      <section className="goals">
        <div className="goals__container">
          <div className="goals__description">
            <div className="goals__label">Goal:</div>
            <div className="goals__data">{goalDetails.name}</div>
          </div>
          <div className="goals__target">
            <div className="goals__label">Target:</div>
            <div className="goals__data">
              {goalDetails.target} {goalDetails.unit}
            </div>
          </div>
          <div className="goals__progress">
            <div className="goals__label">Current Progress:</div>
            <div className="goals__data">{goalDetails.current_progress}</div>
          </div>
          <div className="goals__deadline">
            <div className="goals__label">Deadline:</div>
            <div className="goals__data">{goalDetails.deadline_progress}</div>
          </div>
        </div>
      </section>
    </>
  );
}
