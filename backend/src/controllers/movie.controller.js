const movieModel = require("../models/movie.model");
const { uploadFile } = require("../services/storage.service");


const createMovie = async(req, res) => {
    const token = req.cookies.token;

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
// Get all movies with backend pagination, search, and optional category filtering
async function getAllMovie(req, res) {
    try {
        let { page = 1, limit = 12, search = "", category } = req.query;

        page = Number.parseInt(page, 10);
        limit = Number.parseInt(limit, 10);

        // Validate pagination parameters
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                message: "Page must be a positive integer"
            });
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                message: "Limit must be between 1 and 100"
            });
        }

        // Build MongoDB filter
        const filter = {};

        if (search.trim()) {
            filter.movieName = {
                $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i"
            };
        }

        if (category && category.trim()) {
            const escapedCategory = category.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.category = {
                $in: [new RegExp(`^${escapedCategory}$`, "i")]
            };
        }

        // Count matching movies before pagination
        const totalMovies = await movieModel.countDocuments(filter);

        // Fetch only movies for the requested page
        const movies = await movieModel.find(filter)
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(totalMovies / limit);

        return res.status(200).json({
            message: "Movies fetched successfully",
            movies,
            pagination: {
                currentPage: page,
                totalPages,
                totalMovies,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (err) {
        console.error("Error fetching movies:", err);

        return res.status(500).json({
            message: "Failed to fetch movies"
        });
    }
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
        let { page = 1, limit = 12, search = "" } = req.query;

        page = Number.parseInt(page, 10);
        limit = Number.parseInt(limit, 10);

        // Validate pagination parameters
        if (
            !Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1 || limit > 100
        ) {
            return res.status(400).json({
                message: "Invalid page or limit. Page must be positive and limit must be between 1 and 100."
            });
        }

        // Escape special regex characters
        const escapedCategory = categoryName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        // Filter by category
        const filter = {
            category: {
                $in: [new RegExp(`^${escapedCategory}$`, "i")]
            }
        };

        // Add search filter if search term exists
        if (search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.movieName = {
                $regex: escapedSearch,
                $options: "i"
            };
        }

        // Count matching movies before pagination
        const totalMovies = await movieModel.countDocuments(filter);

        // Fetch movies for the requested page
        const movies = await movieModel.find(filter)
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(totalMovies / limit);

        return res.status(200).json({
            message: "Movies fetched successfully",
            movies,
            pagination: {
                currentPage: page,
                totalPages,
                totalMovies,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (err) {
        console.error("Error fetching movies by category:", err);

        return res.status(500).json({
            message: "Failed to fetch movies by category"
        });
    }
}


module.exports = {createMovie, getMovie, getAllMovie, updateMovie, deleteMovie, getMoviesByCategory};