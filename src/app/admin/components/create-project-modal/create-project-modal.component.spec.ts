import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownTriggerDirective, GenticsUICoreModule, ModalService, Notification, OverlayHostService } from 'gentics-ui-core';

import { CreateProjectModalComponent } from './create-project-modal.component';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { provideMockI18n } from '../../../../testing/configure-component-test';
import { SchemaEffectsService } from '../../../core/providers/effects/schema-effects.service';
import { mockMeshNode, mockProject, mockSchema, mockUser } from '../../../../testing/mock-models';
import { By } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';

describe('CreateProjectModal', () => {

    let appState: TestApplicationState;

    @NgModule(provideMockI18n({
        imports: [FormsModule, ReactiveFormsModule, SharedModule, GenticsUICoreModule],
        providers: [
            { provide: ApplicationStateService, useClass: TestApplicationState },
            { provide: SchemaEffectsService, useValue: jasmine.createSpyObj('schemaEffects', ['loadSchemas']) },
            Notification,
            OverlayHostService
        ],
        entryComponents: [CreateProjectModalComponent],
        declarations: [CreateProjectModalComponent]
    }))
    class TestModule {}

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule, GenticsUICoreModule],
            providers: [ModalService],
            declarations: [TestComponent]
        });
    });

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            auth: {
                currentUser: 'd8b043e818144e27b043e81814ae2713'
            }, entities: {
                project: {
                    '55f6a4666eb8467ab6a4666eb8867a84': mockProject({
                        uuid: '55f6a4666eb8467ab6a4666eb8867a84',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }
                    }),
                    'b5eba09ef1554337aba09ef155d337a5': mockProject({
                        uuid: 'b5eba09ef1554337aba09ef155d337a5',
                        name: 'tvc',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }
                    }),
                    '1fdb2624b6cb4b3a8ef7b5baabe47c74': mockProject({
                        uuid: '1fdb2624b6cb4b3a8ef7b5baabe47c74',
                        name: 'test3',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }
                    })
                },
                node: {
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': mockMeshNode({ uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b' }),
                    'fdc937c9ce0440188937c9ce04b0185f': mockMeshNode({ uuid: 'fdc937c9ce0440188937c9ce04b0185f' })
                },
                user: {
                    d8b043e818144e27b043e81814ae2713: mockUser({
                        uuid: 'd8b043e818144e27b043e81814ae2713',
                        lastname: 'Maulwurf',
                        firstname: 'Hans',
                        username: 'HM',
                    })
                },
                schema: {
                    '5953336e4342498593336e4342398599': mockSchema({
                        uuid: '5953336e4342498593336e4342398599',
                        name: 'mockSchema1'
                    }),

                    'b73bbc9adae94c88bbbc9adae99c88f5': mockSchema({
                        uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                        name: 'mockSchema2'
                    }),
                    'eb967a50be7e4602967a50be7ed60265': mockSchema({
                        uuid: 'eb967a50be7e4602967a50be7ed60265',
                        name: 'mockSchema3'
                    }),

                    'a38a5c9af65844f28a5c9af65804f2e1': mockSchema({
                        uuid: 'a38a5c9af65844f28a5c9af65804f2e1',
                        name: 'mockSchema4'
                    }),
                    '832235ac0570435ea235ac0570b35e10': mockSchema({
                        uuid: '832235ac0570435ea235ac0570b35e10',
                        name: 'mockSchema5'
                    }),
                    '4de05a1e64894a44a05a1e64897a445b': mockSchema({
                        uuid: '4de05a1e64894a44a05a1e64897a445b',
                        name: 'mockSchema6'
                    })
                }
            }
        });
    });

    it(`shows a warning if the schema is not a container`,
        componentTest(() => CreateProjectModalComponent, fixture => {
            fixture.componentInstance.schema.setValue(appState.now.entities.schema['832235ac0570435ea235ac0570b35e10']);
            fixture.detectChanges();

            const warning = fixture.nativeElement.querySelector('.non-container-warning');
            expect(warning).toBeDefined();
        })
    );

    it(`shows changes in the schema entities`,
        componentTest(() => TestComponent, (fixture, instance) => {
            instance.openCreateProjectModal();
            tick();
            triggerEvent(fixture.debugElement.query(By.directive(DropdownTriggerDirective)).nativeElement, 'click');
            fixture.detectChanges();
            tick();
            expect(getSelectOptions(fixture).length).toBe(6);
            appState.mockState({
                entities: {
                    schema: {}
                }
            });
            fixture.detectChanges();
            tick();
            expect(getSelectOptions(fixture).length).toBe(0);
        })
    );
});

function getSelectOptions(fixture: ComponentFixture<TestComponent>) {
    return fixture.nativeElement.querySelectorAll('li');
}

function triggerEvent(element: HTMLElement, eventName: string) {
    const event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
}

@Component({
    template: `<gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {
    constructor(private modalService: ModalService) {}

    openCreateProjectModal(): Promise<any> {
        return this.modalService.fromComponent(CreateProjectModalComponent)
            .then(modal => modal.open());
    }
}