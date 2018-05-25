import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { ProjectResponse } from '../../common/models/server-models';
import { AdminProjectsState } from '../models/admin-projects-state.model';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';

import { mergeEntityState } from './entity-state-actions';

@Injectable()
@Immutable()
export class AdminProjectsStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1)
    private adminProjects: AdminProjectsState;
    @CloneDepth(0)
    private entities: EntityState;

    constructor() {
        super({
            uses: ['adminProjects', 'entities'],
            initialState: {
                adminProjects: {
                    loadCount: 0,
                    projectList: [],
                    projectDetail: null
                }
            }
        });
    }

    fetchProjectsStart() {
        this.adminProjects.loadCount++;
    }

    fetchProjectsSuccess(projects: ProjectResponse[]) {
        this.adminProjects.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            project: projects
        });
        this.adminProjects.projectList = projects.map(project => project.uuid);
    }

    fetchProjectsError() {
        this.adminProjects.loadCount--;
    }

    createProjectStart(): void {
        this.adminProjects.loadCount++;
    }

    createProjectSuccess(project: ProjectResponse) {
        this.adminProjects.loadCount--;
        this.entities = mergeEntityState(this.entities, { project: [project] });
        this.adminProjects.projectList = [...this.adminProjects.projectList, project.uuid];
    }

    createProjectError(): void {
        this.adminProjects.loadCount--;
    }

    deleteProjectStart(): void {
        this.adminProjects.loadCount++;
    }

    deleteProjectSuccess(projectUuid: string) {
        this.adminProjects.projectList = this.adminProjects.projectList.filter(uuid => uuid !== projectUuid);
    }

    deleteProjectError(): void {
        this.adminProjects.loadCount--;
    }
}