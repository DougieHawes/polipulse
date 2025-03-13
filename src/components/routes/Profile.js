import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [personality, setPersonality] = useState();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  const { name } = useParams();

  const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${name}&client_id=${process.env.REACT_APP_ACCESS_KEY}&w=400&h=400&fit=crop`;

  const fetchPoliticalData = async () => {
    return {
      overall: "left",
      abortion: "pro-choice",
      climate_change: "believer",
      guns: "pro",
      marijuana: "unknown",
      summary: "summary",
    };
  };

  useEffect(() => {
    const getPersonality = async () => {
      setPersonality({ name });

      const imageResponse = await fetch(UNSPLASH_URL);
      const imageData = await imageResponse.json();

      if (imageData && imageData.results && imageData.results.length > 0) {
        setImage(imageData.results[0].urls.small);
      } else {
        setImage("");
      }

      const politicalSummary = await fetchPoliticalData();

      const personalityData = {
        name,
        image: image || "",
        overall: politicalSummary.overall || "Unknown",
        abortion: politicalSummary.abortion || "Unknown",
        climate_change: politicalSummary.climate_change || "Unknown",
        guns: politicalSummary.guns || "Unknown",
        marijuana: politicalSummary.marijuana || "Unknown",
        summary: politicalSummary.summary || "Unknown",
      };

      setPersonality(personalityData);

      setLoading(false);
    };

    getPersonality();
  }, [name]);

  if (loading) return <div>Loading...</div>;

  if (!personality) return <div>No personality found</div>;

  return (
    <div>
      <h1>{personality.name}</h1>
      {image ? (
        <img src={image} alt={personality.name} />
      ) : (
        <p>No image available</p>
      )}
      <div>
        <p>
          <strong>Overall Political Leaning:</strong> {personality.overall}
        </p>
        <p>
          <strong>Abortion:</strong> {personality.abortion}
        </p>
        <p>
          <strong>Climate Change:</strong> {personality.climate_change}
        </p>
        <p>
          <strong>Guns:</strong> {personality.guns}
        </p>
        <p>
          <strong>Marijuana:</strong> {personality.marijuana}
        </p>
        <p>
          <strong>Summary:</strong> {personality.summary}
        </p>
      </div>
    </div>
  );
};

export default Profile;
