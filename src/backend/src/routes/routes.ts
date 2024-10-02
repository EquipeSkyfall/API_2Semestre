import express from 'express'
import { userControllers } from '../controllers/userControllers';
import { productController } from '../controllers/productControllers';
import { supplierController } from '../controllers/supplierControllers';
import { categoryController } from '../controllers/categoryControllers';

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
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route('/products/missingdata')
  .get(productController.getProductsWithMissingData)

router
  .route('/products/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct)

router
  .route('/products/:id/suppliers')
  .post(productController.addSupplierToProduct)
  .delete(productController.removeSupplierFromProduct)

// Supplier routes
router
  .route('/suppliers')
  .get(supplierController.getSuppliers)
  .post(supplierController.createSupplier)

router
  .route('/suppliers/:id')
  .get(supplierController.getSupplierById)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier)

router
  .route('/suppliers/:id/products')
  .get(supplierController.getProductsFromSupplier)
  .post(supplierController.addProductToSupplier)
  .delete(supplierController.removeProductFromSupplier)

// Category routes
router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory)

router
  .route('/categories/:id')
  .get(categoryController.getCategoryById)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

export default router
