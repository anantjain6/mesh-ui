import { Component } from '@angular/core';

import { NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { errorHashFor, ErrorCode } from '../../common/form-errors';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-number-field',
    templateUrl: './number-field.component.html',
    styleUrls: ['./number-field.scss']
})
export class NumberFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue();
        this.api = api;
        this.setValidity(this.value);
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: number): void {
        this.api.setValue(value);
        this.setValidity(value);
    }

    /**
     * Mark as invalid if field is required and has a falsy value, or if min or max bounds are exceeded
     */
    private setValidity(value: any): void {
        const min = this.api.field.min;
        const max = this.api.field.max;
        const requiredError = this.api.field.required && (typeof value !== 'number' || Number.isNaN(value));
        const minError = min !== undefined && value < min;
        const maxError = max !== undefined && max < value;

        const errors = {
            ...errorHashFor(ErrorCode.REQUIRED, requiredError),
            ...errorHashFor(ErrorCode.MIN_VALUE, minError),
            ...errorHashFor(ErrorCode.MAX_VALUE, maxError)
        };
        this.api.setError(errors);
    }
}
