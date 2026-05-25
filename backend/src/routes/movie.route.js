const express = require("express");
const {createMovie, getMovie, getAllMovie, updateMovie, deleteMovie, getMoviesByCategory} = require("../controllers/movie.controller.js");
const {authAdmin, authUser} = require("../middlewares/auth.middleware.js");
const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post("/upload", authAdmin, 
    upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "screenshots", maxCount: 10 }
  ]), createMovie);
  
router.put("/update/:movieId", authAdmin,
    upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "screenshots", maxCount: 10 }
  ]), updateMovie);

router.delete("/delete/:movieId", authAdmin, deleteMovie);

router.get("/", getAllMovie);
router.get("/category/:categoryName", getMoviesByCategory);
router.get("/:movieId", getMovie);



module.exports = router;