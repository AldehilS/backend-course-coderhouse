import mongoose from "mongoose";

export default async function dbConnection(url, db) {
  try {
    await mongoose.connect(url, {
      dbName: db,
    })
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}
