const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { calculateNPS } = require("../commons/utilities");

const ResponseSchema = new Schema(
  {
    agent_id: {
      type: Schema.ObjectId,
      ref: "User",
      required: "Agent required",
    },
    medium: {
      type: String,
      required: "Survey medium required",
    },
    resolution: {
      type: Number,
      required: "Resolution score required",
    },
    satisfaction: {
      type: Number,
      required: "Satisfaction score required",
    },
    verbatim: {
      type: String,
    },
    nps_score: {
      type: Number,
    },
  },
  { timestamps: true }
);

ResponseSchema.pre("save", async function preSave(next) {
  const response = this;
  try {
    const calculatedScore = calculateNPS(
      response.resolution,
      response.satisfaction
    );
    response.nps_score = calculatedScore;
    return next();
  } catch (err) {
    return next(err);
  }
});

ResponseSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

let Response = mongoose.model("Response", ResponseSchema);

module.exports = Response;
