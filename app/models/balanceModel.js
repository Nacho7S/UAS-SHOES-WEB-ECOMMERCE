import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  money: {
    type: Number,
    default: 0,
  }
})

const Balance = mongoose.models.Balance || mongoose.model('Balance', balanceSchema);

export default Balance;