import { AuthState } from './auth-state.model';
import { UIState } from './ui-state.model';
import { EditorState } from './editor-state.model';
import { EntityState } from './entity-state.model';

export interface AppState {
    auth: AuthState;
    editor: EditorState;
    ui: UIState;
    entities: EntityState;
}