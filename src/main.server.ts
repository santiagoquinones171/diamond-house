import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './app/components/header/header';
import { Footer } from './app/components/footer/footer';
import { AnimatedBackground } from './app/components/animated-background/animated-background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AnimatedBackground],
  templateUrl: './app/app.html',
  styleUrls: ['./app/app.css']
})
export class App {
  protected readonly title = signal('joyas');
}