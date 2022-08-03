const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.BD_CNN, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
    });

    console.log("BD Online");
  } catch (e) {
    console.log(e);
    throw new Error("Error al inicializar BD");
  }
};

module.exports = {
  dbConnection,
};
