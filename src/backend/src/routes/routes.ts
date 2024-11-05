import express from 'express'
import { userControllers } from '../controllers/userControllers';
import { productController } from '../controllers/productControllers';
import { supplierController } from '../controllers/supplierControllers';
import { categoryController } from '../controllers/categoryControllers';
import { sectorController } from '../controllers/sectorControllers';
import { batchController } from '../controllers/batchControllers';
import { shipmentController } from '../controllers/shippingControllers';
import {auth, restrictedTo} from '../controllers/authControllers'
const router = express.Router();


// router.param('id',controllers.checkID)


// User routes
router
  .route('/users')
  .get(auth,userControllers.getAllUsers)
  .post(userControllers.createUser);


router
  .route('/users/me')
  .get(auth,userControllers.getMe)

router
  .route('/users/login')
  .post(userControllers.login)



// router
// .route('/check-email')
// .post(userControllers.checkEmailExists)

router
  .route('/users/:id')
  .get(auth,userControllers.getUserById) // GET a user by ID
  .patch(auth,userControllers.updateUser)     // Update a user by ID
  .delete(auth,userControllers.deleteUser); // Delete a user by ID



// Product routes
router
  .route('/products')
  .get(auth,productController.getProducts) // Generate product list with/without search terms/filters
  .post(auth,productController.createProduct); //Adds new product to database

// Find Products with missing data
router
  .route('/products/missingdata') 
  .get(productController.getProductsWithMissingData) // Searches for products missing category/sector data

// Updating, deleting and selecting unique product
router
  .route('/products/:id')
  .get(auth,productController.getProductById) // Pulls product info by ID
  .patch(auth,productController.updateProduct) // Updates product by ID
  .delete(auth,restrictedTo('Gerente'),productController.deleteProduct) // Deletes product by ID

// Editing product/supplier relationships for unique product
router
  .route('/products/:id/suppliers')
  .post(auth,productController.addSupplierToProduct) // Adds supplier for product by ID
  .delete(auth,productController.removeSupplierFromProduct) // Removes supplier from product by ID

router
  .route('/products/:id/batches')
  .get(auth,productController.getProductBatches)


// Supplier routes
router
  .route('/suppliers')
  .get(auth,supplierController.getSuppliers)
  .post(auth,supplierController.createSupplier)

router
  .route('/suppliers/:id')
  .get(auth,supplierController.getSupplierById)
  .patch(auth,supplierController.updateSupplier)
  .delete(auth,supplierController.deleteSupplier)

router
  .route('/suppliers/:id/products')
  .get(auth,supplierController.getProductsFromSupplier)
  .post(auth,supplierController.addProductsToSupplier)
  .delete(auth,supplierController.removeProductFromSupplier)



// Category routes
router
  .route('/categories')
  .get(auth,categoryController.getCategories)
  .post(auth,categoryController.createCategory)

router
  .route('/categories/:id')
  .get(auth,categoryController.getCategoryById)
  .patch(auth,categoryController.updateCategory)
  .delete(auth,categoryController.deleteCategory)



// Sector routes
router
  .route('/sectors')
  .get(auth,sectorController.getSectors)
  .post(auth,sectorController.createSector)

router
  .route('/sectors/:id')
  .get(auth,sectorController.getSectorById)
  .patch(auth,sectorController.updateSector)
  .delete(auth,sectorController.deleteSector)



// Batch routes
router
  .route('/batches')
  .get(auth,batchController.getBatches)
  .post(auth,batchController.createBatch)

router
  .route('/batches/:id')
  .get(auth,batchController.getBatchById)
  .patch(auth,batchController.updateBatch)
  .delete(auth,batchController.deleteBatch)



// Shipment routes
router
  .route('/shipments')
  .get(auth,shipmentController.getShipments)
  .post(auth,shipmentController.createShipment)

router
  .route('/shipments/:id')
  .get(auth,shipmentController.getShipmentById)
  .patch(auth,shipmentController.updateShipment)
  .delete(auth,shipmentController.deleteShipment)

export default router
