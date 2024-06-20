import mongoose, { mongo } from "mongoose";

const joinCampaignSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  campaignFanId: {
    type: String,
    required: true,
  },
  campaignOwnerId: {
    type: String,
    required: true,
  },
  campaignId: {
    type: String,
    required: true,
  },
});

const emailStatusSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  reporterId: {
    type: String,
    required: true,
  },
  reportId: {
    type: String,
    required: true,
  },
});
const complainSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  complainantId: {
    type: String,
    required: true,
  },
  reportId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const ReportCommentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    reportId: {
      type: String,
      required: true,
    },
    reporterId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const voteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  reportId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const reportUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
    },

    id: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    userBadge: {
      type: String,
    },

    userType: {
      type: String,
    },
  },
  { timestamps: true }
);

const reportSchema = new mongoose.Schema(
  {
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    reportCategory: {
      type: String,
    },
    reporterId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
    },
    solveStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const threadSchema = new mongoose.Schema(
  {
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    thredCategory: {
      type: String,
    },
    creatorId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
    },
  },
  { timestamps: true }
);
const campaignSchema = new mongoose.Schema(
  {
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    campaignCategory: {
      type: String,
    },
    creatorId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
    },
    skillSet: {
      type: String,
    },
    numberOfPeopleNeeded: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Create a Mongoose model
export const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);

export const Thread =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);

export const ReportUser =
  mongoose.models.ReportUser || mongoose.model("ReportUser", reportUserSchema);

export const EmailStatus =
  mongoose.models.EmailStatus ||
  mongoose.model("EmailStatus", emailStatusSchema);

export const Complaint =
  mongoose.models.Complaint || mongoose.model("Complaint", complainSchema);

export const ReportComment =
  mongoose.models.ReportComment ||
  mongoose.model("ReportComment", ReportCommentSchema);

export const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

export const JoinCampaign =
  mongoose.models.JoinCampaign ||
  mongoose.model("JoinCampaign", joinCampaignSchema);

/* export const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export const Follow =
  mongoose.models.Follow || mongoose.model("Follow", followSchema);
 */
