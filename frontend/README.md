MovieMart 🎬

A modern full-stack movie streaming and download platform built with the MERN stack. Users can browse movies by category, search movies, view movie details, and admins can upload and manage movies with posters and screenshots using ImageKit.

🚀 Features
👥 User Features
Browse trending movies
Search movies instantly
Filter movies by categories
Responsive modern UI
View movie details
Download movie links (480p / 720p / 1080p)
🔐 Admin Features
Admin authentication with JWT
Upload movie posters
Upload multiple movie screenshots
Update movie details
Delete movies
Manage categories
🖼️ Media Handling
Image upload using Multer
Cloud image storage with ImageKit
Multiple screenshots support
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS
React Router DOM
Axios
Lucide React
React Hot Toast
Backend
Node.js
Express.js
MongoDB
Mongoose



moviesMart/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│
└── README.md


⚙️ Installation
1. Clone Repository
git clone https://github.com/piyush22123/moviemart.git
2. Install Dependencies
Backend
cd backend
npm install
Frontend
cd frontend
npm install
🔑 Environment Variables

Create a .env file inside backend:

PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
▶️ Run Project
Backend
npm run dev
Frontend
npm run dev
📸 Screenshots

Add your project screenshots here.

![Home Page](your-image-link)
🌟 Future Improvements
Movie watchlist
Ratings & reviews
Pagination / infinite scrolling
Video streaming
Dark/light mode
🤝 Contributing

Contributions are welcome.

Fork the repository
Create a new branch
Commit your changes
Push to branch
Open a Pull Request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Piyush Malviya

GitHub: piyush22123
JWT Authentication
Multer
ImageKit
