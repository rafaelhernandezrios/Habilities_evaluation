import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1); // Detiene el servidor si hay error
  }
};

export default connectDB;
