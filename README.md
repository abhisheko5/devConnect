🚀 DevConnect — Developer Social Platform

DevConnect is a full-stack social media application built for developers to connect, share, and grow together. Users can register, create posts (with images), follow others, like/comment on posts, and discover trending content — just like a dev-focused LinkedIn + Instagram!

---

🧩 Features

👤 User
- Register/Login/Logout with JWT auth & HTTP-only cookies
- Profile update (bio, skills, GitHub username, avatar)
- Follow/Unfollow users
- View other devs by search

📝 Posts
- Create posts with caption, image, and tags (Cloudinary upload)
- Like / Unlike posts
- Comment on posts
- View your posts or all posts (with pagination)
- Trending tags and tag-based search

🔐 Authentication & Security
- JWT-based Access and Refresh Tokens
- Auto token refresh
- Password hashing using bcrypt
- Rate Limiting, Helmet for secure headers, CORS

---

⚙️ Tech Stack

| Layer         | Tech                     |
|---------------|--------------------------|
| **Frontend**  | *Coming soon...*         |
| **Backend**   | Node.js, Express.js      |
| **Database**  | MongoDB, Mongoose        |
| **Storage**   | Cloudinary (for images)  |
| **Auth**      | JWT, bcrypt              |
| **Security**  | Helmet, CORS, Rate Limit |
| **Others**    | Multer, Cookie-parser    |

---

## 🗂 Folder Structure

**backend**
src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── app.js
└── server.js

frontend — (Coming soon) React or Next.js client



---

## 🔧 Installation & Run

```bash
git clone https://github.com/abhisheko5/devConnect
cd devconnect
npm install
npm run start

📄 License
This project is licensed under the MIT License.

🌟 Project Status
✅ Backend Completed
🔜 Frontend in progress...
🤝 Open to collaboration — Ping me if you're interested!