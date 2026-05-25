const movieModel = require("../models/movie.model");
const { uploadFile } = require("../services/storage.service");


const createMovie = async(req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try{
        let {
            movieName, 
            downloadLinks,
            storyline,
            category,
            imdbId,
        } = req.body;

        // Convert JSON strings to arrays
        downloadLinks = JSON.parse(downloadLinks);
        category = JSON.parse(category);

        const posterFile = req.files.poster?.[0];
        const screenshotFiles = req.files.screenshots || [];

        if (!posterFile) {
            return res.status(400).json({
                message: "Poster image is required"
            });
        }

        const posterLink = await uploadFile(
            posterFile.buffer.toString("base64")
        );

        // to store screenshots urls
        const screenshotLinks = [];
        // multiple screenshot images hence using for loop in array
        for (const file of screenshotFiles) {
            //uploading every file one by one and then adding its urls to screenshot array
            const uploadedScreenshot = await uploadFile(
                file.buffer.toString("base64")
            );

            screenshotLinks.push(uploadedScreenshot.url);
        }

        const movie = await movieModel.create({
            movieName,
            downloadLinks,
            posterLink: posterLink.url,
            storyline,
            category,
            imdbId,
            screenshots: screenshotLinks
        })

        return res.status(201).json({
            message: "Movie created successfully",
            movie : {
                id: movie._id,
                movieName: movie.movieName,
                downloadLinks: movie.downloadLinks,
                posterLink: movie.posterLink,
                storyline: movie.storyline,
                category: movie.category,
                imdbId: movie.imdbId,
                screenshots:movie.screenshots
            }
        })
    }
    catch(err){
        console.log("error in catch", err)
        return res.status(401).json({message: "Failed to upload movie"});

    }
}



// get movie
async function getMovie(req, res) {
    try {
        const { movieId } = req.params;

        const movie = await movieModel.findById(movieId);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            message: "Movie fetched successfully",
            movie
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



// get all movies
async function getAllMovie(req, res){
    
    const movies = await movieModel.find().limit(10) // to only fetch 10 movie at a time

    if (!movies) {
        return res.status(404).json({
            message: "Movies not found"
        });
    }

    return res.status(200).json({
        message: "Movies fetched successfully",
        movies: movies,
    })
}



async function updateMovie(req, res) {
    try {

        const { movieId } = req.params;

        let {
            movieName,
            downloadLinks,
            storyline,
            category,
            imdbId
        } = req.body;

        const movie = await movieModel.findById(movieId);

        const newPoster = req.files.poster?.[0];
        const newScreenshots = req.files.screenshots || [];

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        // Parse JSON strings
        if (downloadLinks) {
            downloadLinks = JSON.parse(downloadLinks);
        }

        if (category) {
            category = JSON.parse(category);
        }

        // Update poster
        if (newPoster) {

            const poster = await uploadFile(
                newPoster.buffer.toString("base64")
            );

            movie.posterLink = poster.url;
        }


        // to store screenshots urls
        if (newScreenshots.length > 0) {

            const screenshotLinks = [];

            for (const file of newScreenshots) {

                const uploadedScreenshot = await uploadFile(
                    file.buffer.toString("base64")
                );

                screenshotLinks.push(uploadedScreenshot.url);
            }

            movie.screenshots = screenshotLinks;
        }


        // Update fields
        if (movieName) {
            movie.movieName = movieName;
        }

        if (downloadLinks) {
            movie.downloadLinks = downloadLinks;
        }

        if (storyline) {
            movie.storyline = storyline;
        }

        if (category) {
            movie.category = category;
        }

        if (imdbId) {
            movie.imdbId = imdbId;
        }

        await movie.save();

        return res.status(200).json({
            message: "Movie updated successfully"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}


async function deleteMovie(req, res){
    try {

        const { movieId } = req.params;

        const movie = await movieModel.findById(movieId);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        await movieModel.findByIdAndDelete(movieId);

        return res.status(200).json({
            message: "Movie deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
}



async function getMoviesByCategory(req, res) {
    try {

        const { categoryName } = req.params;

        const movies = await movieModel.find({
            category: {
                $in: [new RegExp(`^${categoryName}$`, "i")]
            }
        });

        return res.status(200).json({
            message: "Movies fetched successfully",
            total: movies.length,
            movies
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
}


module.exports = {createMovie, getMovie, getAllMovie, updateMovie, deleteMovie, getMoviesByCategory};