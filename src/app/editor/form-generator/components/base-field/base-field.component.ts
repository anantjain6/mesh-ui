import { Component, HostBinding } from '@angular/core';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { MeshNode, NodeFieldType } from '../../../../common/models/node.model';

/**
 * This is the base class from which all of the built-in form controls inherit.
 */
@Component({
    selector: 'base-field'
})
export abstract class BaseFieldComponent  {
    @HostBinding('class.mesh-field')
    readonly isMeshField = true;

    @HostBinding('style.width')
    width: string;

    @HostBinding('style.height')
    height: string;

    /**
     * Returns true is the control is in a valid state.
     */
    get isValid(): boolean {
        return this._isValid;
    }
    private _isValid: boolean = true;

    /**
     * Initializes the field, providing it with the api object which gives access to properties
     * necessary for rendering the field.
     */
    abstract init(api: MeshFieldControlApi): void;

    /**
     * This method will be invoked whenever the field's value might have changed. "Might have" because it is
     * also invoked when a child field has changed, e.g. when a list item is changed, `valueChange()` is called
     * on the list item *and* the list.
     */
    abstract valueChange(newValue: NodeFieldType, oldValue?: NodeFieldType): void;

    /**
     * This method will be invoked whenever then value of another field in the node is changed.
     */
    nodeFieldChange(path: SchemaFieldPath, value: any, node: MeshNode): void {
        // no-op, can be optionally implemented by subclasses. Primary use-case it to enable the
        // `onNodeChange()` method of the MeshFieldControlApi.
    }

    /**
     * This method is invoked whenever the containing form's width changes.
     */
    formWidthChange(widthInPixels: number): void {
        if (widthInPixels < 800) {
            this.setWidth('100%');
        } else {
            this.setWidth('42%');
        }
    }

    /**
     * Sets the css width of the host component. Intended for use by custom controls.
     */
    setWidth(value: string) {
        this.width = value;
    }

    /**
     * Sets the css height of the host component. Intended for use by custom controls.
     */
    setHeight(value: string) {
        this.height = value;
    }

    /**
     * Set the validity state of the control.
     */
    setValid(value: boolean) {
        this._isValid = value;
    }
}