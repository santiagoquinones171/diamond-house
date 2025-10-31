import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, keyframes, query, stagger } from '@angular/animations';

interface Product {
  name: string;
  description: string;
  price: string;
  icon: string;
  category: string;
  flipped: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideInFromTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('0.8s 0.2s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardStagger', [
      transition(':enter', [
        query('.product-card', [
          style({ opacity: 0, transform: 'translateY(50px) scale(0.95)' }),
          stagger(120, [
            animate('0.7s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('buttonPop', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.4s ease-out', keyframes([
          style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.15)', opacity: 1, offset: 0.5 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class Products implements OnInit {
  particles: { x: number; y: number }[] = [];
  categories = ['Todos', 'Anillos', 'Collares', 'Aretes', 'Pulseras'];
  selectedCategory = 'Todos';
  searchTerm = '';
  
  products: Product[] = [
    { name: 'Anillo Eterno', description: 'Elegante anillo de compromiso con diamantes', price: '$1,299', icon: 'assets/images/ia1.png', category: 'Anillos', flipped: false },
    { name: 'Anillo Zafiro', description: 'Anillo de compromiso con zafiro azul', price: '$1,499', icon: 'assets/images/ia2.png', category: 'Anillos', flipped: false },
    { name: 'Collar Imperial', description: 'Collar de oro con piedras preciosas', price: '$899', icon: 'assets/images/ia3.png', category: 'Collares', flipped: false },
    { name: 'Collar Perla', description: 'Collar de perlas naturales con cierre de oro', price: '$799', icon: 'assets/images/ia4.png', category: 'Collares', flipped: false },
    { name: 'Aretes Luminosos', description: 'Aretes de oro blanco con zafiros', price: '$599', icon: 'assets/images/ia5.png', category: 'Aretes', flipped: false },
    { name: 'Aretes Diamante', description: 'Aretes de oro amarillo con diamantes', price: '$699', icon: 'assets/images/ia6.png', category: 'Aretes', flipped: false },
    { name: 'Pulsera Real', description: 'Pulsera de plata con detalles de oro', price: '$399', icon: 'assets/images/ia7.png', category: 'Pulseras', flipped: false },
    { name: 'Pulsera Esmeralda', description: 'Pulsera de oro blanco con esmeraldas', price: '$999', icon: 'assets/images/ia8.png', category: 'Pulseras', flipped: false }
  ];

  filteredProducts: Product[] = [];
  
  isVisible = {
    hero: false,
    filter: false,
    products: false,
    featured: false
  };

  ngOnInit() {
    // Generate particles with smooth animation
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    
    this.filteredProducts = this.products;
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const options = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const section = target.dataset['section'];
          if (section && section in this.isVisible) {
            this.isVisible[section as keyof typeof this.isVisible] = true;
          }
        }
      });
    }, options);

    setTimeout(() => {
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(section => observer.observe(section));
    }, 100);
  }

  filterProducts(category: string) {
    this.selectedCategory = category;
    
    // Reset flipped state
    this.products.forEach(p => p.flipped = false);
    
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = [...filtered];
  }

  toggleFlip(product: Product) {
    product.flipped = !product.flipped;
  }
}