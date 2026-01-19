import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: String, required: true }, // මොන බඩුවටද Review කළේ
    userName: { type: String, required: true },  // කවුද කළේ
    userEmail: { type: String, required: true }, // ඊමේල් එක
    rating: { type: Number, required: true, min: 1, max: 5 }, // තරු 1-5
    comment: { type: String, required: true }, // විස්තරය
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;