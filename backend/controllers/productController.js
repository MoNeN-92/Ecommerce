// Before ❌:
exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll({
    include: [{ model: Category, as: 'category' }],
    order: [['created_at', 'DESC']]
  });
}

// After ✅:
exports.getAllProducts = async (req, res) => {
  const { category_id, limit, offset, search } = req.query;
  
  const where = {};
  
  if (category_id) {
    where.category_id = parseInt(category_id); // ✅ Filter!
  }
  
  if (search) {
    where.name = { [Op.iLike]: `%${search}%` }; // ✅ Search!
  }
  
  const products = await Product.findAll({
    where, // ✅ Apply filters!
    include: [{ model: Category, as: 'category' }],
    limit: limit ? parseInt(limit) : undefined,
    order: [['created_at', 'DESC']]
  });
}