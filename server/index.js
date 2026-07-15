import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/plan-trip", (req, res) => {
  const { source, destination, days } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: "source and destination required" });
  }

  const places = [
    `${destination} Fort`,
    `${destination} Museum`,
    `${destination} Local Market`,
  ];

  const hotels = [
    `${destination} Residency`,
    `${destination} Grand Hotel`,
    `${destination} Comfort Stay`,
  ];

  res.json({
    success: true,
    trip: { source, destination, days: Number(days || 1), places, hotels },
  });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));