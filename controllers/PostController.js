import PostModel from "../models/Post.js";

export const getAll = async (request, response) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    response.json(posts);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Could not get all posts",
    });
  }
};

export const getOne = async (request, response) => {
  try {
    const postId = request.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (error, document) => {
        if (error) {
          console.log(error);
          return response.status(500).json({
            message: "Could not load posts",
          });
        }

        if (!document) {
          return response.status(404).json({
            message: "Post not found",
          });
        }

        response.json(document);
      }
    );
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Could not get all posts",
    });
  }
};

export const remove = async (request, response) => {
  try {
    const postId = request.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (error, document) => {
        if (error) {
          console.log(error);
          return response.status(500).json({
            message: "Could not delete post",
          });
        }

        if (!document) {
          return response.status(404).json({
            message: "Post was not found",
          });
        }

        response.json({
          success: "true",
        });
      }
    );
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Could not get all posts",
    });
  }
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

export const update = async (request, response) => {
  try {
    const postId = request.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: request.body.title,
        description: request.body.description,
        postImage: request.body.postImage,
        tags: request.body.tags,
        user: request.userId,
      }
    );

    response.json({
      success: true,
    });
    
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Could not update the post",
    });
  }
};
