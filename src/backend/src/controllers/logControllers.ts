import { Response, Request } from 'express';
import prisma  from '../dbConnector';
import { request } from 'http';

export interface RequestWithUser extends Request {
    user?: {
        id: number;
        role: string;
    };
}

interface LogOptions {
    id_produto?: number;
    id_categoria?: number;
    id_setor?: number;
    id_fornecedor?: number;
    id_saida?: number;
    id_lote?: number;
    id_affected_user?: number;
}

class LogControllers {
    public getLogs = async (request: Request, response: Response) => {
        const { search='', page='1', limit='10' } = request.query
        const pageNumber = parseInt(page as string)
        const limitNumber = parseInt(limit as string)
        const skip = (pageNumber - 1) * limitNumber

        try {
            const whereCondition: any = {}

            if (search) {
                const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    
                if (datePattern.test(search as string)) {
                    // Exact date search (e.g., '2024-10-02')
                    whereCondition.data_compra = new Date(search as string);
                } else {
                    // Handle other formats or provide an error response
                    return response.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
                }
            }

            const totalLogs = await prisma.systemLog.count({
                where: whereCondition
            })

            const logs = await prisma.systemLog.findMany({
                where: whereCondition,
                skip,
                take: limitNumber,
                orderBy: {
                    data_processo: 'desc'
                },
                include: {
                    users: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            // Create an array of product, category, sector, supplier, and affected user IDs to fetch names later
            const productIds = logs.map(log => log.id_produto).filter(id => id !== null);
            const categoryIds = logs.map(log => log.id_categoria).filter(id => id !== null);
            const sectorIds = logs.map(log => log.id_setor).filter(id => id !== null);
            const supplierIds = logs.map(log => log.id_fornecedor).filter(id => id !== null);
            const affectedUserIds = logs.map(log => log.id_affected_user).filter(id => id !== null);

            // Fetch names from respective tables
            const [products, categories, sectors, suppliers, affectedUsers] = await Promise.all([
                prisma.produto.findMany({ where: { id_produto: { in: productIds } }, select: { id_produto: true, nome_produto: true } }),
                prisma.categoria.findMany({ where: { id_categoria: { in: categoryIds } }, select: { id_categoria: true, nome_categoria: true } }),
                prisma.setor.findMany({ where: { id_setor: { in: sectorIds } }, select: { id_setor: true, nome_setor: true } }),
                prisma.fornecedor.findMany({ where: { id_fornecedor: { in: supplierIds } }, select: { id_fornecedor: true, razao_social: true } }),
                prisma.users.findMany({ where: { id: { in: affectedUserIds } }, select: { id: true, name: true } }),
            ]);

            // Create a map for easier lookup
            const productMap = Object.fromEntries(products.map(product => [product.id_produto, product.nome_produto]));
            const categoryMap = Object.fromEntries(categories.map(category => [category.id_categoria, category.nome_categoria]));
            const sectorMap = Object.fromEntries(sectors.map(sector => [sector.id_setor, sector.nome_setor]));
            const supplierMap = Object.fromEntries(suppliers.map(supplier => [supplier.id_fornecedor, supplier.razao_social]));
            const affectedUserMap = Object.fromEntries(affectedUsers.map(user => [user.id, user.name]));

            // Enhance logs with corresponding names
            const enrichedLogs = logs.map(log => ({
                ...log,
                nome_produto: productMap[log.id_produto || 0] || null,
                nome_categoria: categoryMap[log.id_categoria || 0] || null,
                nome_setor: sectorMap[log.id_setor || 0] || null,
                nome_fornecedor: supplierMap[log.id_fornecedor || 0] || null,
                nome_affected_user: affectedUserMap[log.id_affected_user || 0] || null,
            }));

            response.status(200).json({
                enrichedLogs,
                totalLogs,
                totalPages: Math.ceil(totalLogs / limitNumber),
                currentPage: pageNumber
            })
        } catch(error) {
            console.error('Error fetching logs: ', error)
            response.status(500).json({ message: 'Error fetching logs:', error })
        }
    };

    public logActions = async (
        id_user: number | undefined,
        action_type: string,
        options?: LogOptions
    ) => {
        if (id_user === undefined) {
            throw new Error("User ID is not defined.");
        }

        // Prepare the log data, including optional IDs
        const logData: any = {
            id_user: id_user,
            action_type: action_type,
            data_processo: new Date(),
            ...options, // Spread the options into the logData
        };

        // Create the log in the database
        await prisma.systemLog.create({
            data: logData,
        });
    }
}

const logControllers = new LogControllers();

export { logControllers };