import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

// Definición de la estructura de datos (Jewel)
interface Jewel {
  id: number;
  nombre: string;
  precio: string;
  imagen: string; 
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  animations: [
    trigger('bounceIn', [
      transition(':enter', [
        animate('1s ease-out', keyframes([
          style({ transform: 'translateY(-100%)', offset: 0 }),
          style({ transform: 'translateY(25%)', offset: 0.3 }),
          style({ transform: 'translateY(-10%)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('1s 0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  // Lista de joyas destacadas
  featuredJewels: Jewel[] = [
    { 
      id: 1, 
      nombre: 'Anillo World Champions', 
      precio: '$299.99', 
      imagen: 'joya1.png' 
    },
    { 
      id: 2, 
      nombre: 'Brasalete Oro Puro', 
      precio: '$450.00', 
      imagen: 'joya2.png' 
    },
    { 
      id: 3, 
      nombre: 'Anillo De Diseñador', 
      precio: '$180.50', 
      imagen: 'joya3.png' 
    }
  ];
}
