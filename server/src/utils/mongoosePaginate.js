/**
 * Mongoose pagination plugin
 * Adds a paginate method to mongoose queries
 */
module.exports = function() {
  const mongoose = require('mongoose');
  

  mongoose.Query.prototype.paginate = async function(options) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
 
    const countQuery = this.model.find().merge(this);
    
 
    const totalDocs = await countQuery.countDocuments();
    
    
    const docs = await this.skip(skip).limit(limit);
    
  
    const totalPages = Math.ceil(totalDocs / limit);
    
    // Return paginated results
    return {
      docs,
      totalDocs,
      totalPages,
      page,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    };
  };
};
