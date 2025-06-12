const validate = (req, res, next) => {

  const { id, name, description, price, category, inStock } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing product ID' });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing product name' });
    }

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing product description' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing category' });
    }

    if ( !inStock || typeof inStock !== 'boolean') {
      return res.status(400).json({ success: false, message: 'inStock must be true or false' });
    }

    next();
};

export default validate;