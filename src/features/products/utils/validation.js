export const productValidation = {
  validateName(name) {
    if (!name || name.trim().length === 0) {
      return { isValid: false, message: 'Product name is required' };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Product name must be at least 2 characters' };
    }
    return { isValid: true };
  },

  validatePrice(price) {
    if (!price && price !== 0) {
      return { isValid: false, message: 'Price is required' };
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
      return { isValid: false, message: 'Price must be a number' };
    }
    if (priceNum <= 0) {
      return { isValid: false, message: 'Price must be greater than 0' };
    }
    return { isValid: true };
  },

  validateStock(stock) {
    if (!stock && stock !== 0) {
      return { isValid: false, message: 'Stock is required' };
    }
    const stockNum = parseInt(stock);
    if (isNaN(stockNum)) {
      return { isValid: false, message: 'Stock must be a number' };
    }
    if (stockNum < 0) {
      return { isValid: false, message: 'Stock must be 0 or greater' };
    }
    return { isValid: true };
  },

  validateProduct(productData) {
    const errors = {};
    const nameValidation = this.validateName(productData.name);
    if (!nameValidation.isValid) errors.name = nameValidation.message;

    const priceValidation = this.validatePrice(productData.price);
    if (!priceValidation.isValid) errors.price = priceValidation.message;

    const stockValidation = this.validateStock(productData.stock);
    if (!stockValidation.isValid) errors.stock = stockValidation.message;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};