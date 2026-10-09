
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import type { Pantalon, Corte } from '../../models/pantalon.model';
import { PantalonService } from '../../service/pantalon.service';

type OrdenPrecio = 'original' | 'asc' | 'desc';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo {
  private readonly pantalonService = inject(PantalonService);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');

  readonly pantalones = toSignal(
    this.pantalonService.obtenerTodos().pipe(
      catchError(() => {
        this.errorMessage.set(
          'No se pudo cargar el catálogo. Verificá que json-server esté funcionando.'
        );

        return of([] as Pantalon[]);
      })
    ),
    { initialValue: [] as Pantalon[] }
  );

  readonly filtroCategoria = signal<Corte | ''>('');

  readonly ordenPrecio = signal<OrdenPrecio>('original');

  readonly pantalonesFiltrados = computed(() => {
    const categoria = this.filtroCategoria();

    const resultado = this.pantalones().filter(
      (pantalon) => categoria === '' || pantalon.cut === categoria
    );

    switch (this.ordenPrecio()) {
      case 'asc':
        resultado.sort((a, b) => a.salePrice - b.salePrice);
        break;

      case 'desc':
        resultado.sort((a, b) => b.salePrice - a.salePrice);
        break;

      case 'original':
      default:
        break;
    }

    return resultado;
  });

  verDetalle(id: string): void {
    void this.router.navigate(['/detalle', id]);
  }
}
