import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { Post } from "../entity/Post";
import { Profile } from "../entity/Profile";
import { User } from "../entity/User";

export const createUser = async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const profileRepository = AppDataSource.getRepository(Profile);

  try {
    const newProfile = await profileRepository.save({
      bio: "Software Engineer",
      avatar: "https://avatars.githubusercontent.com/u/64120319?v=4",
    });

    const savedUser = await userRepository.save({
      ...req.body,
      profile: newProfile,
    });

    // const savedUser = await userRepository
    //   .createQueryBuilder("user")
    //   .insert()
    //   .into(User)
    //   .values({ ...req.body, profile: newProfile })
    //   .execute();

    // const savedUser = await userRepository
    //   .createQueryBuilder("user")
    //   .relation(User, "profile")
    //   .of(savedUser)
    //   .set(newProfile);

    console.log("savedUser: ", savedUser);

    const userWithProfile = await userRepository.findOne({
      where: { id: savedUser.id },
      relations: ["profile"],
    });

    return res.send({
      success: true,
      message: "User created Successfully",
      data: userWithProfile,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      message: err.message,
    });
  }
};

export const createPost = async (req, res) => {
  const postRepository = AppDataSource.getRepository(Post);
  const userRepository = AppDataSource.getRepository(User);
  const categoryRepository = AppDataSource.getRepository(Category);

  try {
    const user = await userRepository.findOne({ where: { id: 34 } });

    if (!user) {
      throw new Error("User not found");
    }

    const tech = await categoryRepository.findOne({ where: { id: 1 } });
    const prog = await categoryRepository.findOne({ where: { id: 2 } });

    // Demonstrating the use of relations ManyToOne and ManyToMany
    const newPost = postRepository.create({
      ...req.body,
      user: user,
      categories: [tech, prog],
    });

    await postRepository.save(newPost);

    // Fetch the user including the posts, profile and their categories
    const userWithPosts = await userRepository.findOne({
      where: { id: 34 },
      relations: ["profile", "posts", "posts.categories"],
    });

    return res.send({
      success: true,
      message: "Post created Successfully here's the Data...",
      data: userWithPosts,
    });
  } catch (err) {
    console.log("err: ", err);
    return res.send({
      success: false,
      message: err.message,
    });
  }
};

export const getUser = async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: req.params.id });

  res.send(user);
};

export const getAllUsers = async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.find();

  res.send(users);
};

export const updateUser = async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.update(
    { id: Number(req.params.id) },
    req.body
  );

  res.send(users);
};

export const deleteUser = async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);

  const deletedUser = await userRepository.delete({
    firstName: req.params.name,
  });

  res.send(deletedUser);
};
