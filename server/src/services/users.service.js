import User from "../models/user.js";

export const getUsersService = async (page,limit)=>{
    const users = await User.find()
      .select("name _id email profilePicture")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const totalUsers = await User.countDocuments();
    return {
        users,
        totalUsers,
        page,
        totalPages: Math.ceil(totalUsers / limit)
    };
}
export const getUsersBySearchService = async (searchQuery) => {
    const users = await User.find({ _id: { $in: searchQuery.split(",") } });
    return users;
};
