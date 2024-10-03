import express, { Response, Request } from 'express';
import prisma from '../dbConnector';

class BatchControllers {

    public getBatches = async (request: Request, response: Response) => {
        const { search='', page='1', limit='10' } = request.query
        const pageNumber = parseInt(page as string)
        const limitNumber = parseInt(limit as string)
        const skip = (pageNumber - 1) * limitNumber

        try {
            const whereCondition: any = {}

            if (search) {
                const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
                const monthYearPattern = /^\d{4}-\d{2}$/; // YYYY-MM
                const yearPattern = /^\d{4}$/; // YYYY
    
                if (datePattern.test(search as string)) {
                    // Exact date search (e.g., '2024-10-02')
                    whereCondition.data_compra = new Date(search as string);
                } else if (monthYearPattern.test(search as string)) {
                    // Month/Year search (e.g., '2024-10')
                    const [year, month] = (search as string).split('-');
                    whereCondition.data_compra = {
                        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                        lt: new Date(parseInt(year), parseInt(month), 1), // Start of the next month
                    };
                } else if (yearPattern.test(search as string)) {
                    const year = parseInt(search as string);
                    whereCondition.data_compra = {
                        gte: new Date(year, 0, 1), // Start of the year
                        lt: new Date(year + 1, 0, 1), // Start of the next year
                    };
                }
            }

            const totalBatches = await prisma.produto.count({
                where: whereCondition
            })

            const batches = await prisma.lote.findMany({
                where: whereCondition,
                skip,
                take: limitNumber
            })
            response.status(200).json({
                batches,
                totalBatches,
                totalPages: Math.ceil(totalBatches / limitNumber),
                currentPage: pageNumber
            })
        } catch (error) {
            console.error('Error fetching batches:', error )
            response.status(500).json({ message: 'Error fetching batches:', error })
        }
    };

    public createBatch = async (request: Request, response: Response) => {
        
    }
}

const batchController = new BatchControllers()

export { batchController }