var express = require('express');
var router = express.Router();

const productService = {
  products: [{ id: "q12397", name: "bag", price: "100" }],
  createProduct: function (product) {
    console.log('ptoduct1: ' + product)
    product.id = 'q' + Math.ceil((Math.random() * 1000000))

    console.log('this.products: ' + this.products)
    console.log('product2: ' + product)
    this.products.push(product)
    return product
  },
  deleteProduct: function (id) {
    const rest = this.products.filter((product) => product.id !== id)
    if (rest.length < this.products.length) {
      this.products = rest
      return true
    } else {
      return false
    }
  },
  updateProduct: function (id, product) {
    const productIndexId = this.products.findIndex((product) => product.id === id);
    console.log('this.products: ', this.products, '  id: ', id, '     productIndexId: ', productIndexId)
    if (productIndexId != -1) {
      this.products[productIndexId] = product
      return product
    }
    return null;  // todo: throw exception
  },
  getProducts: function () { console.log(this.products); return this.products },
  getProductDetails: function (id) {
    return this.products.find((product) => product.id === id)
  }
}

/* GET all products*/
router.get('/', (req, resp, next) => {
  const productsList = productService.getProducts()
  return resp.status(200).json(productsList)

})

/* Get product by id */
router.get('/:id', (req, resp, next) => {
  
    if (req.params.id != null) {
      const product = productService.getProductDetails(req.params.id)
      if (product != null) {
        return resp.status(200).json(product)
      } else {
        const error = { message: "product not found"}
        return resp.status(404).json(error)
      }
    } else {
      const error = { message: "product id is required"}
      return resp.status(400).json(error)
    }  
  
});

/* Create product */
router.post('/', (req, resp, next) => {

  const item = req.body
  const createdItem = productService.createProduct(item)
  return resp.status(200).json(createdItem)

});


/* Delete product by id */
router.delete('/:id', (req, resp, next) => {

  if (req.params.id != null) {
    const deleteResult = productService.deleteProduct(req.params.id,)
    if (deleteResult) {
      return resp.status(200).json()
    } else {
      const error = { message: "product not found" }
      return resp.status(404).json(error)
    }
  } else {
    const error = { message: "product id is required" }
    return resp.status(400).json(error)
  }

});

/* Update product by id */
router.put('/:id', (req, resp, next) => {

  if (req.params.id != null) {
    const updateResult = productService.updateProduct(req.params.id, req.body)
    if (updateResult != null) {
      return resp.status(200).json(updateResult)
    } else {
      const error = { message: "product not found" }
      return resp.status(404).json(error)
    }
  } else {
    const error = { message: "product id is required" }
    return resp.status(400).json(error)
  }
});


module.exports = router;