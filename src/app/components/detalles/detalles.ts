
import { CurrencyPipe } from '@angular/common';
import {
  Component,
  effect,
  inject,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { Formulario } from '../formulario/formulario';

import type { Pantalon } from '../../models/pantalon.model';
import { PantalonService } from '../../service/pantalon.service';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [CurrencyPipe, Formulario],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css'
})
export class Detalles {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pantalonService = inject(PantalonService);

  readonly errorMessage = signal('');
  readonly editando = signal(false);

  // Datos recibidos desde el servidor.
  readonly pantalonRemoto = toSignal(
    this.route.paramMap.pipe(
      map(parametros => parametros.get('id')),
      switchMap(id => {
        if (!id) {
          this.errorMessage.set(
            'No se especificó el identificador del pantalón.'
          );

          return of(null);
        }

        this.errorMessage.set('');

        return this.pantalonService.obtenerPorId(id).pipe(
          catchError(() => {
            this.errorMessage.set(
              'No se encontró el pantalón solicitado.'
            );

            return of(null);
          })
        );
      })
    ),
    { initialValue: null as Pantalon | null }
  );

  // Estado local que podemos actualizar después de editar.
  readonly pantalon = signal<Pantalon | null>(null);

  private readonly sincronizarPantalon = effect(() => {
    this.pantalon.set(this.pantalonRemoto());
  });

  volverAlCatalogo(): void {
    void this.router.navigateByUrl('/');
  }

  habilitarEdicion(): void {
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    this.editando.set(false);
    this.errorMessage.set('');
  }

  actualizarPantalon(actualizado: Pantalon): void {
    this.pantalon.set(actualizado);
    this.editando.set(false);
    this.errorMessage.set('');
  }

  eliminarPantalon(): void {
    const actual = this.pantalon();

    if (!actual) {
      return;
    }

    const confirmado = window.confirm(
      `¿Estás seguro de que querés eliminar "${actual.modelName}"?`
    );

    if (!confirmado) {
      return;
    }

    this.pantalonService.eliminar(actual.id).subscribe({
      next: () => {
        void this.router.navigateByUrl('/');
      },
      error: () => {
        this.errorMessage.set(
          'No se pudo eliminar el pantalón. Intentá nuevamente.'
        );
      }
    });
  }
}
