import express from 'express'
import { userControllers } from '../controllers/userControllers';
import { productController } from '../controllers/productControllers';

const router = express.Router();


// router.param('id',controllers.checkID)


// User routes
router
.route('/users')
.get(userControllers.getAllUsers)
.post(userControllers.createUser);

// router
// .route('/check-email')
// .post(userControllers.checkEmailExists)

router
    .route('/users/:id')
    .get(userControllers.getUserById) // GET a user by ID
    .patch(userControllers.updateUser)     // Update a user by ID
    .delete(userControllers.deleteUser); // Delete a user by ID



// Product routes
router
  .route('/products')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/products/id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

  router.route('/products/search').get((req, res, next) => {
    console.log('Search route hit:', req.query); // Log the query parameters
    next(); // Pass control to the next handler (the controller method)
}, productController.searchProductName);
export default router
