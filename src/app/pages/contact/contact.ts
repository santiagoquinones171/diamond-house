import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { trigger, transition, style, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.7s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('buttonPulse', [
      transition(':enter', [
        animate('1s ease-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.03)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('staggerInputs', [
      transition(':enter', [
        query('.form-group', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('staggerInfoItems', [
      transition(':enter', [
        query('.info-item', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(120, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  showSuccess = false;
  submitting = false;

  isVisible = {
    hero: false,
    form: false,
    info: false,
    map: false
  };

  constructor(private fb: FormBuilder) {
    // Creamos el formulario con validaciones mejoradas
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required, // Hacer obligatorio
        Validators.minLength(7),
        Validators.maxLength(20),
        this.phoneValidator // Validador personalizado
      ]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Validador personalizado para teléfono
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null; // Si está vacío, lo maneja 'required'
    }

    // Remover espacios, guiones y paréntesis para validar
    const cleanValue = value.toString().replace(/[\s\-\(\)]/g, '');
    
    // Validar que solo contenga números y opcionalmente '+'
    const validChars = /^[\+]?[0-9]+$/;
    if (!validChars.test(cleanValue)) {
      return { invalidCharacters: true };
    }

    // Validar longitud (entre 7 y 15 dígitos sin contar el +)
    const digitsOnly = cleanValue.replace(/[\+]/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return { invalidLength: true };
    }

    // Validación específica para Colombia (opcional)
    // Descomentar si solo quieres aceptar números colombianos
    /*
    const colombianPattern = /^(\+?57)?3[0-9]{9}$/; // Celular colombiano
    const fijoPattern = /^[0-9]{7,10}$/; // Fijo
    
    if (!colombianPattern.test(cleanValue) && !fijoPattern.test(cleanValue)) {
      return { invalidColombianPhone: true };
    }
    */

    return null; // Teléfono válido
  }

  // Getter para acceder a los controles fácilmente
  get f(): any {
    return this.contactForm.controls;
  }

  // Método para obtener mensajes de error específicos del teléfono
  getPhoneErrorMessage(): string {
    const phoneControl = this.f.phone;
    
    if (phoneControl.hasError('required')) {
      return 'El teléfono es obligatorio';
    }
    if (phoneControl.hasError('minlength')) {
      return 'El teléfono debe tener al menos 7 dígitos';
    }
    if (phoneControl.hasError('maxlength')) {
      return 'El teléfono no puede tener más de 20 dígitos';
    }
    if (phoneControl.hasError('invalidCharacters')) {
      return 'El teléfono solo puede contener números, espacios, guiones y paréntesis';
    }
    if (phoneControl.hasError('invalidLength')) {
      return 'El teléfono debe tener entre 7 y 15 dígitos';
    }
    if (phoneControl.hasError('invalidColombianPhone')) {
      return 'Ingrese un número de teléfono colombiano válido';
    }
    
    return '';
  }

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
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

  cancelar() {
    if (this.submitting) return;
    this.contactForm.reset();
  }

  enviar(): void {
    // Mostrar errores visuales
    this.contactForm.markAllAsTouched();

    // Si hay errores, no continuar
    if (this.contactForm.invalid) {
      // Opcional: mostrar alerta con errores específicos
      if (this.f.phone.invalid) {
        console.log('Error en teléfono:', this.getPhoneErrorMessage());
      }
      return;
    }

    this.submitting = true;

    // Preparamos los datos (trim sencillo y limpiar teléfono)
    const payload = {
      nombre: (this.f.name.value || '').toString().trim(),
      email: (this.f.email.value || '').toString().trim(),
      telefono: (this.f.phone.value || '').toString().trim(),
      asunto: (this.f.subject.value || '').toString().trim(),
      mensaje: (this.f.message.value || '').toString().trim(),
      createdAt: new Date().toISOString()
    };

    try {
      // Descargamos JSON en el navegador
      const text = JSON.stringify(payload, null, 2);
      const blob = new Blob([text], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'formulario-contacto.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de éxito
      this.showSuccess = true;

      // Reset simple
      this.contactForm.reset();

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Error al descargar JSON:', err);
      alert('No fue posible descargar el archivo.');
    } finally {
      this.submitting = false;
    }
  }
}