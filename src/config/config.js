// To deliver my project I needed to hardcode the database connection string in the config.js file.
// I'm aware that this is not the best practice, but it was necessary in order for my proffessor to be able to run the project without requiring any additional configuration.

export const config = {
  port: 8080,
  db: {
    host: "mongodb+srv://piratelotus123:kQcjpHWRjtaEFya4jLHv@cluster0.nag3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    database: "ecommerce-coderhouse-project",
  },
};
