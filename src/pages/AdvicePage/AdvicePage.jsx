import React from "react";
import AdviceCard from "../../components/AdviceCard/AdviceCard";
import "./AdvicePage.scss";

const adviceData = [
  {
    title: "The 10 Best Exercises to Build Muscle and Strength",
    description:
      "From bench presses to dips, these essential exercises can help you maximize muscle growth and strength.",
    linkUrl: "https://www.strengthlog.com/best-exercises-to-build-muscle/",
  },
  {
    title: "The Importance of Rest Days",
    description: "Learn why rest days are just as important as your workouts.",
    linkUrl: "https://www.healthline.com/health/exercise-fitness/rest-day",
  },
  {
    title: "Weight Loss: 6 Strategies for Success",
    description: "The key to sustainable weight loss is long-term lifestyle changes in diet and physical activity.",
    linkUrl: "https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20047752"
  },
];

const AdvicePage = () => {
  return (
    <div className="advice-page">
      <h1>Fitness & Health Advice</h1>
      <div className="advice-list">
        {adviceData.map((advice, index) => (
          <AdviceCard
            key={index}
            title={advice.title}
            description={advice.description}
            linkUrl={advice.linkUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvicePage;
