import { getUsersService,getUsersBySearchService} from "../services/users.service.js";

export const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const { users, totalUsers, totalPages } = await getUsersService(
      Number(page),
      Number(limit)
    );
    res.status(200).json({
      users,
      totalUsers,
      page: Number(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUsersBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const users = await getUsersBySearchService(searchQuery);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
