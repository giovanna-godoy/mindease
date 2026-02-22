import { Component, signal, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lofi-player',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './lofi-player.component.html',
  styleUrls: ['./lofi-player.component.css']
})
export class LofiPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('playerElement') playerElement!: ElementRef;
  
  isPlaying = signal(false);
  volume = signal(50);
  currentTrackIndex = signal(0);
  
  private audio: HTMLAudioElement | null = null;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  
  tracks = [
    { name: 'Heroes', url: 'assets/audio/heroes.mp3' },
    { name: 'Cinematic', url: 'assets/audio/cinematic.mp3' },
    { name: 'Enlivening', url: 'assets/audio/enlivening.mp3' }
  ];

  currentTrack = signal(this.tracks[0]);

  constructor() {
    this.audio = new Audio();
    try {
      this.audio.crossOrigin = 'anonymous';
    } catch (e) {
    }
    this.audio.volume = this.volume() / 100;
    this.audio.loop = false;
    this.audio.addEventListener('ended', () => this.nextTrack());
  }

  ngAfterViewInit() {
    const element = this.playerElement.nativeElement;
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  private onMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button, input')) return;
    
    this.isDragging = true;
    const rect = this.playerElement.nativeElement.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    e.preventDefault();
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    
    const x = e.clientX - this.offsetX;
    const y = e.clientY - this.offsetY;
    
    this.playerElement.nativeElement.style.left = `${x}px`;
    this.playerElement.nativeElement.style.top = `${y}px`;
    this.playerElement.nativeElement.style.right = 'auto';
  }

  private onMouseUp() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  togglePlay() {
    this.isPlaying.update(v => !v);
    if (this.isPlaying()) {
      this.playAudio();
    } else {
      this.pauseAudio();
    }
  }

  nextTrack() {
    const nextIndex = (this.currentTrackIndex() + 1) % this.tracks.length;
    this.currentTrackIndex.set(nextIndex);
    this.currentTrack.set(this.tracks[nextIndex]);
    if (this.isPlaying()) {
      this.playAudio();
    }
  }

  setVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.volume.set(Number(value));
    if (this.audio) {
      this.audio.volume = Number(value) / 100;
    }
  }

  private playAudio() {
    if (this.audio) {
      const src = this.currentTrack().url;
      
      if (this.audio.src.indexOf(src) === -1) {
        this.audio.src = src;
        this.audio.load();
      }
      
      this.audio.play().catch(err => console.error('Erro ao tocar:', err));
    }
  }

  private pauseAudio() {
    if (this.audio) {
      this.audio.pause();
    }
  }
}
