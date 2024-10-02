import express, { Response, Request } from 'express';
import prisma from '../dbConnector';

class CategoryControllers {
    public getCategories = async (request: Request, response: Response) => {
        const { search = '', page = '1', limit = '10' } = request.query
        const pageNumber = parseInt(page as string)
        const limitNumber = parseInt(limit as string)
        const skip = (pageNumber - 1) * limitNumber

        try {
            const whereCondition: any = {}

            if (search) {
                whereCondition.nome_categoria = {
                    contains: search
                }
            }

            const totalCategories = await prisma.categoria.count({
                where: whereCondition
            })

            const categories = await prisma.categoria.findMany({
                where: whereCondition,
                skip,
                take: limitNumber
            })

            response.status(200).json({
                categories,
                totalCategories,
                totalPages: Math.ceil(totalCategories / limitNumber),
                currentPage: pageNumber
            })
        } catch (error) {
            console.error('Error fetching categories:', error)
            response.status(500).json({ message: 'Error fetching categories:', error })
        }
    };

    public createCategory = async (request: Request, response: Response) => {
        try {
            const { ...categoryData } = request.body

            const category = await prisma.categoria.create({
                data: categoryData
            })

            response.status(201).json(category)
        } catch (error) {
            response.status(500).json({ message: 'Error creating category:', error })
        }
    };

    public updateCategory = async (request: Request, response: Response) => {
        const { id } = request.params

        const { createdAt, updatedAT, ...dataToUpdate } = request.body
        try {
            const updatedCategory = await prisma.categoria.update({
                where: { id_categoria: Number(id) },
                data: {
                    ...dataToUpdate
                }
            })
            response.status(200).json(updatedCategory)
        } catch (error) {
            response.status(500).json({ message: 'Error updating category:', error })
        }
    };

    public deleteCategory = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            await prisma.produto.updateMany({
                where: { id_categoria: Number(id) },
                data: { id_categoria: null }
            })

            await prisma.categoria.delete({
                where: { id_categoria: Number(id) }
            })
            response.status(200).json({ message: 'Category deleted successfully.' })
        } catch (error) {
            response.status(500).json({ message: 'Error deleting category:', error })
        }
    };

    public getCategoryById = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const categories = await prisma.categoria.findUnique({
                where: { id_categoria: Number(id) }
            })

            if (!categories) {
                return response.status(404).json({ message: 'Category not found.' })
            }

            response.status(200).json(categories)
        } catch (error) {
            response.status(500).json({ message: 'Error fetching category by ID:', error })
        }
    };
}

const categoryController = new CategoryControllers()

export { categoryController }