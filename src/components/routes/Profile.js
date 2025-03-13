import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [personality, setPersonality] = useState();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  const { name } = useParams();

  const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${name}&client_id=${process.env.REACT_APP_ACCESS_KEY}`;

  const fetchPoliticalData = async () => {
    const prompt = `return a json object summarizing the political views of a person named ${name}. Include these categories: overall political leanings (left, right, middle), views on abortion (two word max), climate change (two word max), guns (two word max), marijuana(two word max), and a 600-character summary.`;

    const response = await fetch(process.env.REACT_APP_AI_API_URL, {
      method: "POST", // Correct method for POST request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    // Ensure that the choices array is available and has at least one element
    if (data && data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      // If there's an issue with the API response, return a default message
      return "No political summary available.";
    }
  };

  useEffect(() => {
    const getPersonality = async () => {
      setPersonality({ name });

      // Fetch image from Unsplash
      const imageResponse = await fetch(UNSPLASH_URL);
      const imageData = await imageResponse.json();

      // Ensure that the results array exists and has elements
      if (imageData && imageData.results && imageData.results.length > 0) {
        setImage(imageData.results[0].urls.small); // Use the small image URL
      } else {
        setImage(""); // Set empty if no image found
      }

      // Fetch political data from AI
      const politicalSummary = await fetchPoliticalData();

      // Split the summary and populate the personality object
      const politicalViews = politicalSummary.split("\n");
      const personalityData = {
        name,
        image: image || "",
        overall: politicalViews[0] || "Unknown",
        abortion: politicalViews[1] || "Unknown",
        climate_change: politicalViews[2] || "Unknown",
        guns: politicalViews[3] || "Unknown",
        marijuana: politicalViews[4] || "Unknown",
        summary: politicalViews[5] || "No summary available",
      };

      setPersonality(personalityData);

      setLoading(false);
    };

    getPersonality();
  }, [name]); // Dependency on 'name' to ensure proper rerender

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
