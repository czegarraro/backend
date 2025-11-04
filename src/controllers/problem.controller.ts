/**
 * Problem Controller
 */
import { Request, Response, NextFunction } from 'express';
import { ProblemService } from '../services/problem.service';
import { sendSuccess, sendError } from '../utils/response.utils';
import { ProblemFilters } from '../types/problem.types';

// Lazy initialization to ensure database is connected first
let problemService: ProblemService;
const getProblemService = () => {
  if (!problemService) {
    problemService = new ProblemService();
  }
  return problemService;
};

/**
 * Get all problems with filters and pagination
 */
export const getProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'startTime',
      sortOrder = 'desc',
      impactLevel,
      severityLevel,
      status,
      managementZones,
      affectedEntityTypes,
      entityTags,
      dateFrom,
      dateTo,
      durationMin,
      durationMax,
      hasComments,
      hasGitHubActions,
      evidenceType,
      search,
    } = req.query;

    // Build filters
    const filters: ProblemFilters = {};

    if (impactLevel) {
      filters.impactLevel = Array.isArray(impactLevel) ? impactLevel as any[] : [impactLevel as any];
    }
    if (severityLevel) {
      filters.severityLevel = Array.isArray(severityLevel) ? severityLevel as any[] : [severityLevel as any];
    }
    if (status) {
      filters.status = Array.isArray(status) ? status as any[] : [status as any];
    }
    if (managementZones) {
      filters.managementZones = Array.isArray(managementZones) ? managementZones as string[] : [managementZones as string];
    }
    if (affectedEntityTypes) {
      filters.affectedEntityTypes = Array.isArray(affectedEntityTypes) ? affectedEntityTypes as string[] : [affectedEntityTypes as string];
    }
    if (entityTags) {
      filters.entityTags = Array.isArray(entityTags) ? entityTags as string[] : [entityTags as string];
    }
    if (dateFrom) filters.dateFrom = dateFrom as string;
    if (dateTo) filters.dateTo = dateTo as string;
    if (durationMin) filters.durationMin = Number(durationMin);
    if (durationMax) filters.durationMax = Number(durationMax);
    if (hasComments !== undefined) filters.hasComments = hasComments === 'true';
    if (hasGitHubActions !== undefined) filters.hasGitHubActions = hasGitHubActions === 'true';
    if (evidenceType) {
      filters.evidenceType = Array.isArray(evidenceType) ? evidenceType as string[] : [evidenceType as string];
    }
    if (search) filters.search = search as string;

    const result = await getProblemService().getProblems(
      filters,
      Number(page),
      Number(limit),
      sortBy as string,
      sortOrder as 'asc' | 'desc'
    );

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get problem by ID
 */
export const getProblemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { problemId } = req.params;
    const problem = await getProblemService().getProblemById(problemId);
    sendSuccess(res, { problem });
  } catch (error) {
    if (error instanceof Error && error.message === 'Problem not found') {
      sendError(res, 'NOT_FOUND', 'Problem not found', 404);
    } else {
      next(error);
    }
  }
};

/**
 * Update problem status
 */
export const updateProblemStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { problemId } = req.params;
    const { status } = req.body;

    const problem = await getProblemService().updateProblemStatus(problemId, status);
    sendSuccess(res, { problem }, 'Status updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Problem not found') {
      sendError(res, 'NOT_FOUND', 'Problem not found', 404);
    } else {
      next(error);
    }
  }
};

/**
 * Add comment to problem
 */
export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { problemId } = req.params;
    const { content } = req.body;
    const authorName = req.user?.username || 'Anonymous';

    const problem = await getProblemService().addComment(problemId, content, authorName);
    sendSuccess(res, { problem }, 'Comment added successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Problem not found') {
      sendError(res, 'NOT_FOUND', 'Problem not found', 404);
    } else {
      next(error);
    }
  }
};

/**
 * Get filter options
 */
export const getFilterOptions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const options = await getProblemService().getFilterOptions();
    sendSuccess(res, options);
  } catch (error) {
    next(error);
  }
};
