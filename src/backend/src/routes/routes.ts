import express from 'express'
import { userControllers } from '../controllers/userControllers';
import { productController } from '../controllers/productControllers';
import { supplierController } from '../controllers/supplierControllers';
import { categoryController } from '../controllers/categoryControllers';
import { sectorController } from '../controllers/sectorControllers';
import { batchController } from '../controllers/batchControllers';
import { shipmentController } from '../controllers/shippingControllers';

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
  .get(productController.getProducts) // Generate product list with/without search terms/filters
  .post(productController.createProduct); //Adds new product to database

// Find Products with missing data
router
  .route('/products/missingdata') 
  .get(productController.getProductsWithMissingData) // Searches for products missing category/sector data

// Updating, deleting and selecting unique product
router
  .route('/products/:id')
  .get(productController.getProductById) // Pulls product info by ID
  .patch(productController.updateProduct) // Updates product by ID
  .delete(productController.deleteProduct) // Deletes product by ID

// Editing product/supplier relationships for unique product
router
  .route('/products/:id/suppliers')
  .post(productController.addSupplierToProduct) // Adds supplier for product by ID
  .delete(productController.removeSupplierFromProduct) // Removes supplier from product by ID



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



// Sector routes
router
  .route('/sectors')
  .get(sectorController.getSectors)
  .post(sectorController.createSector)

router
  .route('/sectors/:id')
  .get(sectorController.getSectorById)
  .patch(sectorController.updateSector)
  .delete(sectorController.deleteSector)



// Batch routes
router
  .route('/batches')
  .get(batchController.getBatches)
  .post(batchController.createBatch)

router
  .route('/batches/:id')
  .get(batchController.getBatchById)
  .patch(batchController.updateBatch)
  .delete(batchController.deleteBatch)



// Shipment routes
router
  .route('/shipments')
  .get(shipmentController.getShipments)
  .post(shipmentController.createShipment)

router
  .route('/shipments/:id')
  .get(shipmentController.getShipmentById)
  .patch(shipmentController.updateShipment)
  .delete(shipmentController.deleteShipment)

export default router
