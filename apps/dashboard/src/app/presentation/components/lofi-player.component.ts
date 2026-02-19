import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lofi-player',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './lofi-player.component.html',
  styleUrls: ['./lofi-player.component.css']
})
export class LofiPlayerComponent implements OnDestroy {
  isPlaying = signal(false);
  volume = signal(50);
  currentTrackIndex = signal(0);
  
  private audio: HTMLAudioElement | null = null;
  
  tracks = [
    { name: 'Chill Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { name: 'Study Session', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { name: 'Focus Flow', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
  ];

  currentTrack = signal(this.tracks[0]);

  constructor() {
    this.audio = new Audio();
    this.audio.volume = this.volume() / 100;
    this.audio.loop = false;
    this.audio.addEventListener('ended', () => this.nextTrack());
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
      this.audio.src = this.currentTrack().url;
      this.audio.play().catch(err => console.error('Erro ao tocar:', err));
    }
  }

  private pauseAudio() {
    if (this.audio) {
      this.audio.pause();
    }
  }
}
