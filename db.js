const mongoose = require("mongoose");
const dbUrl = "mongodb://localhost/test";

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true },
  error => {
    if (error) {
      console.log("数据库连接失败", error);
    } else {
      console.log("数据库连接成功。");
    }
  }
);

const novelSchema = new mongoose.Schema(
  {
    name: String,
    resourceLink: String,
    counter: Number
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey:false
  }
);

const Novel = mongoose.model("Novel", novelSchema);

function insertNovel(novelRes) {
  let novel = new Novel({
    name: novelRes.name,
    resourceLink: novelRes.resourceLink,
    counter: 1
  });
  novel.save();
}

async function findByName(name) {
  let novel = await Novel.findOne({ name: name });
  return novel;
}

function updateCounter(novel) {
  const conditions = novel;
  const update = { $set: { counter: novel.counter + 1 } };
  Novel.updateOne(conditions, update, function(error) {
    if (error) {
      console.log(error);
    } else {
      // console.log("Update success!");
    }
  });
}

module.exports = {
  insertNovel,
  findByName,
  updateCounter
};
