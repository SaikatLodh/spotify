import connectDB from "./app/config/db";
import app from "./app/app";

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
