import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";

import {
  saveReview,
  getReviews,
  calculateAverage,
} from "../services/reviewService";

export default function TripRating({ destination }) {
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadReviews() {
    if (!destination) return;

    setLoading(true);

    const data = await getReviews(destination);

    setReviews(data);

    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, [destination]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      await saveReview(
        destination,
        user,
        rating,
        review
      );

      setRating(0);
      setReview("");

      await loadReviews();

      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  }

  return (
    <div className="glass rounded-3xl p-8 mt-8">

      <h2 className="text-3xl font-bold text-white">
        ⭐ Trip Reviews
      </h2>

      <div className="mt-4 text-lg text-yellow-400 font-semibold">
        Average Rating: ⭐ {calculateAverage(reviews)} / 5
      </div>

      <p className="text-slate-300">
        {reviews.length} Review(s)
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >

        <div className="flex gap-2 text-4xl mb-6">

          {[1, 2, 3, 4, 5].map((star) => (

            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
            >
              {star <= rating ? "⭐" : "☆"}
            </button>

          ))}

        </div>

        <textarea
          rows={5}
          placeholder="Write your review..."
          value={review}
          onChange={(e) =>
            setReview(e.target.value)
          }
          className="w-full rounded-xl bg-slate-800 text-white p-4"
        />

        <button
          className="primary-btn mt-5"
          type="submit"
        >
          Submit Review
        </button>

      </form>

      <div className="mt-10">

        <h3 className="text-2xl font-bold text-white mb-5">
          Previous Reviews
        </h3>

        {loading ? (
          <p className="text-slate-300">
            Loading...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-300">
            No reviews yet.
          </p>
        ) : (
          reviews.map((item) => (

            <div
              key={item.id}
              className="glass rounded-2xl p-5 mb-4"
            >

              <div className="flex justify-between">

                <h4 className="font-bold text-white">
                  {item.userName}
                </h4>

                <span className="text-yellow-400">
                  {"⭐".repeat(item.rating)}
                </span>

              </div>

              <p className="text-slate-300 mt-3">
                {item.review}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}