import { useState } from "react";
import { api } from "../lib/api";

export default function ReviewModal({
  productId,
  onClose
}) {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function submitReview() {

    try {

        console.log({
  productId,
  rating,
  comment
});

      await api("/reviews", {
        method: "POST",
        auth: true,
        body: {
  productId,
  rating,
  comment
}
      });

      alert("Review Added Successfully");

      onClose();

    } catch (e) {
  alert(
    e.message ||
    "You already reviewed this product"
  );
}
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-xl w-[400px]">

        <h2 className="text-xl font-bold mb-4">
          Rate Product
        </h2>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          className="border p-2 w-full mb-4"
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Write your review..."
          className="border p-2 w-full h-24"
        />

        <div className="flex gap-3 mt-4">

          <button
            onClick={submitReview}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}