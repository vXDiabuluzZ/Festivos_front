import { Component } from '@angular/core';
import { ApiService } from 'src/app/app.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-consultar-festivo',
  templateUrl: './consultar-festivo.component.html',
  styleUrls: ['./consultar-festivo.component.css']
})

export class ConsultarFestivoComponent {
  fechaSeleccionada: Date = new Date();
  respuesta: string = '';

  constructor(private apiService: ApiService) { }

  consultarFestivo() {
    const fechaISO = new Date(this.fechaSeleccionada);

    //Verifica si la fecha es válida
    if (isNaN(fechaISO.getTime())) {
      console.error('Fecha seleccionada no es un formato de fecha válido');
      Swal.fire('Fecha Inválida', 'Por favor, ingrese una fecha válida.', 'warning');
      return;
    }

    const año = fechaISO.getFullYear();
    const mes = fechaISO.getMonth() + 1;
    const dia = fechaISO.getDate();

    this.apiService.verificarFestivo(año, mes, dia)
      .subscribe(
        (data) => {
          this.respuesta = data;
          this.mostrarResultado();
        },
        (error) => {
          console.error('Error al consultar la API:', error);
          this.respuesta = 'Error al procesar la respuesta del servidor';
          Swal.fire('Error', 'Error al procesar la respuesta del servidor', 'error');
        }
      );
  }

  //Posibles resultados al consultar un festivo
  mostrarResultado() {
    let icono: SweetAlertIcon | undefined = undefined;
    let titulo = '';
    let mensaje = '';

    switch (this.respuesta) {
      case 'Es festivo':
        icono = 'success';
        titulo = 'Es Festivo!';
        mensaje = this.respuesta + ' es un día festivo.';
        break;
      case 'No es festivo':
        icono = 'error';
        titulo = 'No Es Festivo!';
        mensaje = this.respuesta + ' no es un día festivo.';
        break;
      case 'Fecha no válida':
        icono = 'warning';
        titulo = 'Fecha no válida!';
        mensaje = this.respuesta + ' Fecha no válida!';
        break;
      default:
        icono = 'warning';
        titulo = 'Respuesta Inesperada';
        mensaje = 'La respuesta de la API no se reconoce.';
        break;
    }

    Swal.fire({
      icon: icono,
      title: titulo,
      text: mensaje,
    });
  }
}
