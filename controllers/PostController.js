import PostModel from "../models/Post.js";

export const getAll = async (request, response) => {
  try {
    const posts = await PostModel.find();
    response.json(posts);
  } catch (error) {}
};

export const create = async (request, response) => {
  try {
    const document = new PostModel({
      title: request.body.title,
      description: request.body.description,
      postImage: request.body.postImage,
      tags: request.body.tags,
      user: request.userId,
    });

    const post = await document.save();
    response.json(post);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Could not create a post",
    });
  }
};
