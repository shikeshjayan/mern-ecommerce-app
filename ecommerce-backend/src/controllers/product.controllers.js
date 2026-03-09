import Product from "../models/product.js";

/** Get all products with optional keyword, category, sort, pagination. */
export const getAllProducts = async (req, res, next) => {
  try {
    const query = {};
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    const sortBy =
      req.query.sort === "price_low" ? { price: 1 } : { price: -1 };
    const pageSize =
      req.query.limit !== undefined ? Number(req.query.limit) : 12;
    const page = Number(req.query.page) || 1;
    const skip = pageSize === 0 ? 0 : (page - 1) * pageSize;

    const products = await Product.find({ ...query, ...keyword })
      .sort(sortBy)
      .limit(pageSize)
      .skip(skip);

    const count = await Product.countDocuments({ ...query, ...keyword });

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        pages: pageSize === 0 ? 1 : Math.ceil(count / pageSize),
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

/** Create a single product or bulk products (admin). */
export const createProduct = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      const existing = await Product.findOne({
        name: req.body.name,
        category: req.body.category,
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Product already exists",
        });
      }

      const product = new Product({ ...req.body, user: req.user._id });
      const createdProduct = await product.save();

      return res.status(201).json({ success: true, data: createdProduct });
    }

    const products = req.body;
    const existingNames = await Product.find({
      name: { $in: products.map((p) => p.name) },
    }).select("name");

    const duplicateNames = existingNames.map((p) => p.name);
    const validProducts = products.filter(
      (p) => !duplicateNames.includes(p.name),
    );

    if (validProducts.length === 0) {
      return res.status(409).json({
        success: false,
        message: "All products already exist",
      });
    }

    const createdProducts = await Product.insertMany(validProducts, {
      ordered: false,
    });
    res.status(201).json({
      success: true,
      count: createdProducts.length,
      skipped: products.length - validProducts.length,
      data: createdProducts,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate product name in same category already exists",
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

/** Get single product by ID. */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** Update product by ID (admin). */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/** Delete product by ID (admin). */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
