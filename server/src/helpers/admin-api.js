
module.exports = {
  
    searchMovie: async (title,year) => {
      try {
        const searchMovieApi =`https://www.omdbapi.com/?t=${title}&y=${year}&apikey=175b2274`

        return searchMovieApi
        
      } catch (error) {
        return error
      }
    },
  
  };
  