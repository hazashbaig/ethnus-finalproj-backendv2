// const cloudinary = require('cloudinary').v2
          
// cloudinary.config({ 
//   cloud_name: 'dhpvl0j6x', 
//   api_key: '598236528545582', 
//   api_secret: 'rla8ak5LhCrZ7aGU6BLnPMJOfng' 
// });

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg", {upload_preset: "my_preset"}, (error, result)=>{
//   console.log(result, error);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const artworkRoutes = require('./routes/artworks');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/artworks', artworkRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
