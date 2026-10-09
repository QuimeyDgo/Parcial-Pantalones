
import {Component,effect,inject,input,output,signal} from '@angular/core';
import { Router } from '@angular/router';
import {form,FormField,FormRoot,required,min,maxLength} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import type { Pantalon, PantalonFormulario, Talle, Corte} from '../../models/pantalon.model';
import { PantalonService } from '../../service/pantalon.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormField, FormRoot],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {
  private readonly pantalonService = inject(PantalonService);
  private readonly router = inject(Router);

  // Input opcional: si existe, el formulario está en modo edición.
  readonly pantalon = input<Pantalon | undefined>(undefined);

  // Output: emite el pantalón actualizado luego de una edición exitosa.
  readonly actualizado = output<Pantalon>();

  readonly errorMessage = signal('');

  private readonly valoresIniciales: PantalonFormulario = {
    modelName: '',
    salePrice: Number.NaN,
    isInStore: false,
    size: '' as Talle,
    cut: '' as Corte,
    notes: ''
  };

  readonly pantalonModel = signal<PantalonFormulario>({
    ...this.valoresIniciales
  });

  // Sincroniza el modelo del formulario con el input recibido.
  private readonly sincronizarModelo = effect(() => {
    const actual = this.pantalon();

    if (actual) {
      this.pantalonModel.set({
        modelName: actual.modelName,
        salePrice: actual.salePrice,
        isInStore: actual.isInStore,
        size: actual.size,
        cut: actual.cut,
        notes: actual.notes ?? ''
      });
    } else {
      this.pantalonModel.set({
        ...this.valoresIniciales
      });
    }

    this.errorMessage.set('');
  });

  readonly pantalonForm = form(
    this.pantalonModel,
    (campos) => {
      required(campos.modelName, {
        message: 'El nombre del modelo es obligatorio.'
      });

      required(campos.salePrice, {
        message: 'El precio de venta es obligatorio.'
      });

      min(campos.salePrice, 0, {
        message: 'El precio no puede ser negativo.'
      });

      required(campos.size, {
        message: 'Debés seleccionar un talle.'
      });

      required(campos.cut, {
        message: 'Debés seleccionar un corte.'
      });

      maxLength(campos.notes, 200, {
        message: 'La descripción no puede superar los 200 caracteres.'
      });
    },
    {
      submission: {
        action: async (campo) => {
          this.errorMessage.set('');

          const datos = campo().value();
          const actual = this.pantalon();

          try {
            if (actual) {
              // Modo edición: actualizamos el registro existente.
              const actualizado = await firstValueFrom(
                this.pantalonService.editar(actual.id, datos)
              );

              // Informamos el resultado al componente Detalles.
              this.actualizado.emit(actualizado);
            } else {
              // Modo alta: creamos un registro nuevo.
              await firstValueFrom(
                this.pantalonService.agregar(datos)
              );

              await this.router.navigateByUrl('/');
            }

            return;
          } catch {
            this.errorMessage.set(
              'No se pudo guardar el pantalón. Verificá que json-server esté funcionando.'
            );

            return {
              kind: 'serverError',
              message: 'No se pudo guardar el pantalón.'
            };
          }
        }
      }
    }
  );

  limpiarFormulario(): void {
    const actual = this.pantalon();

    if (actual) {
      // En edición, restauramos los datos originales.
      this.pantalonForm().reset({
        modelName: actual.modelName,
        salePrice: actual.salePrice,
        isInStore: actual.isInStore,
        size: actual.size,
        cut: actual.cut,
        notes: actual.notes ?? ''
      });
    } else {
      this.pantalonForm().reset({
        ...this.valoresIniciales
      });
    }

    this.errorMessage.set('');
  }
}
