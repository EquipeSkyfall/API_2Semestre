import express, { Response, Request } from 'express';
import prisma from '../dbConnector';
import { request } from 'http';
import { logControllers, RequestWithUser } from './logControllers';

class SectorControllers {
    public getSectors = async (request: Request, response: Response) => {
        const { search = '', page = '1', limit = 'all' } = request.query
        const pageNumber = parseInt(page as string)
        const limitNumber = limit === 'all' ? undefined : parseInt(limit as string)
        const skip = limitNumber ? (pageNumber - 1) * limitNumber : undefined

        try{
            const whereCondition: any = {}

            if (search) {
                whereCondition.nome_setor = {
                    contains: search
                }
            }

            const totalSectors = await prisma.setor.count({
                where: whereCondition
            })

            const sectors = await prisma.setor.findMany({
                where: whereCondition,
                skip,
                take: limitNumber,
                orderBy: {
                    nome_setor: 'asc',
                },
            })

            response.status(200).json({
                sectors,
                totalSectors,
                totalPages: limitNumber ? Math.ceil(totalSectors / limitNumber) : 1,
                currentPage: limitNumber ? pageNumber : 1
            })
        } catch (error) {
            console.error('Error fetching sectors:', error)
            response.status(500).json({ message: 'Error fetching sectors:', error })
        }
    };

    public createSector = async (request: RequestWithUser, response: Response) => {
        try {
            const { ...sectorData } = request.body

            const sector = await prisma.setor.create({
                data: sectorData
            })

            logControllers.logActions(request.user?.id, "Setor criado.", { id_setor: sector.id_setor })

            response.status(201).json(sector)
        } catch (error) {
            response.status(500).json({ message: 'Error registering sector:', error })
        }
    };

    public updateSector = async (request: RequestWithUser, response: Response) => {
        const { id } = request.params
        
        const { createdAt, updatedAT, ...dataToUpdate } = request.body
        try{
            const updatedSector = await prisma.setor.update({
                where: { id_setor: Number(id) },
                data: {
                    ...dataToUpdate
                }
            })

            logControllers.logActions(request.user?.id, "Setor editado.", { id_setor: Number(id) })

            response.status(200).json(updatedSector)
        } catch (error) {
            response.status(500).json({ message: 'Error updating sector:', error })
        }
    };

    public deleteSector = async (request: RequestWithUser, response: Response) => {
        const { id } = request.params

        try {
            await prisma.produto.updateMany({
                where: { id_setor: Number(id) },
                data: { id_setor: null }
            })

            await prisma.setor.delete({
                where: { id_setor: Number(id) }
            })

            logControllers.logActions(request.user?.id, "Setor deletado.", { id_setor: Number(id) })

            response.status(200).json({ message: 'Sector deleted successfully.' })
        } catch (error) {
            response.status(500).json({ message: 'Error deleting sector:', error })
        }
    };

    public getSectorById = async (request: Request, response: Response) => {
        const { id } = request.params

        try{
            const sectors = await prisma.setor.findUnique({
                where: { id_setor: Number(id) }
            })

            if (!sectors) {
                return response.status(404).json({ message: 'Sector not found.' })
            }
            response.status(200).json(sectors)
        } catch (error) {
            response.status(500).json({ message: 'Error fetching sector by ID:', error })
        }
    };
}

const sectorController = new SectorControllers()

export { sectorController }