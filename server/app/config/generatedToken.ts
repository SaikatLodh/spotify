import User from "../models/userModel";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const findUser: any = await User.findById(userId);

    const accessToken = findUser.generateAccessToken();
    const refreshToken = findUser.generateRefreshToken();
    await findUser.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

export default generateAccessAndRefreshToken;
